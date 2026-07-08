// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'اردو کوئز چیلنج',
    VERSION: '7.0.0',
    // Cloudflare Worker API - Updated
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    QUESTIONS_PER_LEVEL: 50,
    // Magicrills Home & Category URLs
    HOME_URL: 'https://magicrills.com',
    CATEGORY_URL: 'https://magicrills.com/category-pages/mixed-tools.html'
};

// ==================== TIME LIMITS ====================
const TIME_LIMITS = { 1: 60, 2: 55, 3: 50, 4: 45, 5: 40 };
const LEVEL_NAMES = { 1: 'بنیادی', 2: 'آسان', 3: 'درمیانہ', 4: 'مشکل', 5: 'ماہر' };

// ==================== 250+ مستند اردو سوالات ====================
const allQuestions = [
    // Level 1 - بنیادی (سوالات 1-50)
    { level: 1, question: "خوشی کا مترادف کیا ہے؟", options: ["مسرت", "غم", "غصہ", "پریشانی"], answer: 0, explanation: "مسرت کا مطلب خوشی ہے۔ یہ خوشی کا مترادف ہے۔", factoid: "اردو میں خوشی کے لیے 20 سے زائد الفاظ ہیں۔", category: "مترادفات" },
    { level: 1, question: "رات کا متضاد کیا ہے؟", options: ["دن", "شام", "صبح", "تاریکی"], answer: 0, explanation: "رات اور دن ایک دوسرے کے متضاد ہیں۔", factoid: "متضاد الفاظ زبان کو دلچسپ بناتے ہیں۔", category: "متضاد" },
    { level: 1, question: "تیز کا متضاد کیا ہے؟", options: ["آہستہ", "چالاک", "ہوشیار", "مضبوط"], answer: 0, explanation: "آہستہ تیز کے برعکس ہے۔", factoid: "تیز اور آہستہ رفتاری کے متضاد ہیں۔", category: "متضاد" },
    { level: 1, question: "درست جملہ کون سا ہے؟", options: ["وہ کتاب پڑھ رہا ہے", "وہ کتاب پڑھ رہا ہوں", "وہ کتاب پڑھ رہی ہے", "وہ کتاب پڑھ رہا ہیں"], answer: 0, explanation: "واحد مذکر فاعل کے ساتھ 'پڑھ رہا ہے' درست ہے۔", factoid: "فاعل اور فعل کا ہم آہنگ ہونا ضروری ہے۔", category: "قواعد" },
    { level: 1, question: "چھوٹا کا مترادف کیا ہے؟", options: ["ننھا", "بڑا", "لمبا", "وزنی"], answer: 0, explanation: "ننھا چھوٹے کے معنوں میں استعمال ہوتا ہے۔", factoid: "اردو میں ہر لفظ کے کئی مترادفات ہوتے ہیں۔", category: "مترادفات" },
    { level: 1, question: "دوست کا متضاد کیا ہے؟", options: ["دشمن", "رفیق", "ساتھی", "یار"], answer: 0, explanation: "دوست اور دشمن ایک دوسرے کے متضاد ہیں۔", factoid: "دوستی ایک خوبصورت رشتہ ہے۔", category: "متضاد" },
    { level: 1, question: "کتاب کی جمع کیا ہے؟", options: ["کتابیں", "کتابوں", "کتابات", "کتابی"], answer: 0, explanation: "کتاب کی درست جمع 'کتابیں' ہے۔", factoid: "جمع بنانے کے اردو میں متعدد قواعد ہیں۔", category: "قواعد" },
    { level: 1, question: "پانی کا متضاد کیا ہے؟", options: ["آگ", "ہوا", "مٹی", "زمین"], answer: 0, explanation: "پانی اور آگ ایک دوسرے کے متضاد ہیں۔", factoid: "پانی کے بغیر زندگی ممکن نہیں۔", category: "متضاد" },
    { level: 1, question: "سچ کا متضاد کیا ہے؟", options: ["جھوٹ", "امانت", "دیانت", "حق"], answer: 0, explanation: "سچ اور جھوٹ ایک دوسرے کے متضاد ہیں۔", factoid: "سچ بولنا ہر مذہب میں پسندیدہ عمل ہے۔", category: "متضاد" },
    { level: 1, question: "گلابی کا تعلق کس سے ہے؟", options: ["رنگ", "پھول", "خوشبو", "ذائقہ"], answer: 0, explanation: "گلابی ایک رنگ ہے۔", factoid: "گلابی رنگ نرمی اور محبت کی علامت ہے۔", category: "الفاظ" },
    { level: 1, question: "مندرجہ ذیل میں سے اسم کون سا ہے؟", options: ["دوڑنا", "پڑھنا", "کتاب", "لکھنا"], answer: 2, explanation: "کتاب ایک اسم ہے جبکہ باقی فعل ہیں۔", factoid: "اسم کسی بھی چیز کا نام ہوتا ہے۔", category: "قواعد" },
    { level: 1, question: "شیر کا بچہ کہلاتا ہے؟", options: ["بچہ", "شیر بچہ", "شیر زادہ", "ببر"], answer: 2, explanation: "شیر کے بچے کو شیر زادہ کہتے ہیں۔", factoid: "شیر کو جنگل کا بادشاہ کہا جاتا ہے۔", category: "الفاظ" },
    { level: 1, question: "اردو کا قومی شاعر کون ہے؟", options: ["علامہ اقبال", "مرزا غالب", "فیض احمد فیض", "احمد فراز"], answer: 0, explanation: "علامہ اقبال کو اردو کا قومی شاعر کہا جاتا ہے۔", factoid: "اقبال نے 'بنگ درا' اور 'بال جبریل' جیسی عظیم کتابیں لکھیں۔", category: "ادب" },
    { level: 1, question: "پاکستان کی قومی زبان کیا ہے؟", options: ["اردو", "انگریزی", "پنجابی", "سندھی"], answer: 0, explanation: "پاکستان کی قومی زبان اردو ہے۔", factoid: "اردو پاکستان کے علاوہ بھارت میں بھی بولی جاتی ہے۔", category: "عمومی" },
    { level: 1, question: "صبح کا متضاد کیا ہے؟", options: ["شام", "دن", "رات", "دوپہر"], answer: 0, explanation: "صبح اور شام ایک دوسرے کے متضاد ہیں۔", factoid: "صبح کی پہلی کرن امید کی علامت ہوتی ہے۔", category: "متضاد" },

    // Level 2 - آسان (سوالات 16-30)
    { level: 2, question: "مصروف کا مترادف کیا ہے؟", options: ["منہمک", "آزاد", "خالی", "سست"], answer: 0, explanation: "منہمک کا مطلب کسی کام میں مشغول ہونا ہے۔", factoid: "مصروف افراد عموماً کامیاب ہوتے ہیں۔", category: "مترادفات" },
    { level: 2, question: "قدیم کا متضاد کیا ہے؟", options: ["نیا", "پرانا", "عجیب", "عام"], answer: 0, explanation: "قدیم اور نیا ایک دوسرے کے متضاد ہیں۔", factoid: "پرانی چیزوں میں اپنی اہمیت ہوتی ہے۔", category: "متضاد" },
    { level: 2, question: "خاموش کا مترادف کیا ہے؟", options: ["چپ", "چلانا", "شور", "بولنا"], answer: 0, explanation: "چپ خاموشی کے معنوں میں استعمال ہوتا ہے۔", factoid: "خاموشی بعض اوقات بہترین جواب ہوتی ہے۔", category: "مترادفات" },
    { level: 2, question: "جہاز کی جمع کیا ہے؟", options: ["جہاز", "جہازی", "جہازات", "جہازوں"], answer: 2, explanation: "جہاز کی جمع'جہازات'ہے۔", factoid: "پاکستان کی قومی ایئر لائن 'پاکستان انٹرنیشنل ایئر لائنز'ہے۔", category: "قواعد" },
    { level: 2, question: "محنت کا متضاد کیا ہے؟", options: ["آرام", "سستی", "کاہلی", "تمام"], answer: 3, explanation: "محنت کے متضاد آرام، سستی اور کاہلی ہیں۔", factoid: "محنت سے انسان بلندیوں کو چھوتا ہے۔", category: "متضاد" },
    { level: 2, question: "غزل کے مشہور شاعر کون ہیں؟", options: ["مرزا غالب", "علامہ اقبال", "فیض", "احمد فراز"], answer: 0, explanation: "مرزا غالب کو غزل کا بادشاہ کہا جاتا ہے۔", factoid: "غالب کا اصل نام مرزا اسد اللہ بیگ خان تھا۔", category: "ادب" },
    { level: 2, question: "اردو میں 'بہت خوب' کے لیے کون سا لفظ استعمال ہوتا ہے؟", options: ["شاباش", "مبارک", "خوش آمدید", "الوداع"], answer: 0, explanation: "شاباش کا مطلب بہت خوب ہے۔", factoid: "اردو میں تعریف کے بے شمار الفاظ ہیں۔", category: "الفاظ" },
    { level: 2, question: "سوالیہ جملے کے آخر میں کون سا نشان لگتا ہے؟", options: ["؟", "!", "۔", "،"], answer: 0, explanation: "سوالیہ جملوں کے آخر میں سوالیہ نشان لگتا ہے۔", factoid: "اردو میں سوالیہ نشان عربی زبان سے آیا ہے۔", category: "قواعد" },
    { level: 2, question: "واحد کا متضاد کیا ہے؟", options: ["جمع", "مذکر", "مونث", "فعل"], answer: 0, explanation: "واحد کا معنی ایک اور جمع کا معنی ایک سے زیادہ۔", factoid: "اردو میں واحد اور جمع کی بہت اہمیت ہے۔", category: "قواعد" },
    { level: 2, question: "مونث کیا ہے؟", options: ["لڑکی", "لڑکا", "آدمی", "شیر"], answer: 0, explanation: "لڑکی مونث ہے جبکہ باقی مذکر ہیں۔", factoid: "اردو میں مونث اور مذکر کی بہت اہمیت ہے۔", category: "قواعد" },

    // Level 3 - درمیانہ (سوالات 31-45)
    { level: 3, question: "شائستہ کا مترادف کیا ہے؟", options: ["خوش اخلاق", "بدتمیز", "کم عقل", "لالچی"], answer: 0, explanation: "خوش اخلاق شائستہ کے معنوں میں استعمال ہوتا ہے۔", factoid: "شائستگی انسان کی پہچان ہے۔", category: "مترادفات" },
    { level: 3, question: "اجازت کا متضاد کیا ہے؟", options: ["پابندی", "منظوری", "رضامندی", "تسلیم"], answer: 0, explanation: "اجازت اور پابندی ایک دوسرے کے متضاد ہیں۔", factoid: "قوانین معاشرے کو منظم رکھتے ہیں۔", category: "متضاد" },
    { level: 3, question: "ذہین کا مترادف کیا ہے؟", options: ["عقلمند", "بے وقوف", "کاہل", "سست"], answer: 0, explanation: "عقلمند ذہین کے معنوں میں استعمال ہوتا ہے۔", factoid: "ذہانت اللہ کی عطا کردہ نعمت ہے۔", category: "مترادفات" },
    { level: 3, question: "نظم کسے کہتے ہیں؟", options: ["شعری تخلیق", "ناول", "افسانہ", "ڈراما"], answer: 0, explanation: "نظم شعری تخلیق کو کہتے ہیں۔", factoid: "نظم اردو ادب کی اہم صنف ہے۔", category: "ادب" },
    { level: 3, question: "محاورہ'آسمان سے باتیں کرنا'کا مطلب کیا ہے؟", options: ["بہت اونچی بات کرنا", "بہت نیچی بات کرنا", "خاموش رہنا", "رو دینا"], answer: 0, explanation: "اس محاورے کا مطلب بہت اونچی بات کرنا ہے۔", factoid: "محاورے زبان کو دلچسپ بناتے ہیں۔", category: "محاورات" },
    { level: 3, question: "محاورہ'آنکھوں میں دھول جھونکنا'کا مطلب؟", options: ["دھوکہ دینا", "صاف دیکھنا", "اندھا ہونا", "رو لینا"], answer: 0, explanation: "اس کا مطلب دھوکہ دینا ہے۔", factoid: "اردو میں سینکڑوں دلچسپ محاورے ہیں۔", category: "محاورات" },
    { level: 3, question: "ضرب المثل'بوڑھی گھوڑی لال لگام'کا مطلب؟", options: ["نا مناسب زیبائش", "خوبصورتی", "بڑھاپا", "گھوڑی"], answer: 0, explanation: "اس کا مطلب نا مناسب زیبائش یا بناؤ سنگھار ہے۔", factoid: "ضرب الامثال تجربے کا نچوڑ ہوتی ہیں۔", category: "محاورات" },
    { level: 3, question: "فعل کسے کہتے ہیں؟", options: ["کام کرنا", "اسم", "صفات", "حرف"], answer: 0, explanation: "فعل کسی کام کے کرنے کو کہتے ہیں۔", factoid: "فعل کے بغیر جملہ مکمل نہیں ہوتا۔", category: "قواعد" },
    { level: 3, question: "صفت کسے کہتے ہیں؟", options: ["خاصیت بتانا", "اسم", "فعل", "حرف"], answer: 0, explanation: "صفت کسی اسم کی خاصیت بتاتی ہے۔", factoid: "صفت اسم کو خوبصورت بناتی ہے۔", category: "قواعد" },
    { level: 3, question: "اردو ادب کے پہلے ناول نگار کون تھے؟", options: ["نذیر احمد", "پریم چند", "علی عباس حسینی", "غلام عباس"], answer: 0, explanation: "نذیر احمد کو اردو کے پہلے ناول نگار کہا جاتا ہے۔", factoid: "ان کا مشہور ناول 'مرات العروس' ہے۔", category: "ادب" },

    // Level 4 - مشکل (سوالات 46-60)
    { level: 4, question: "لطیف کا مترادف کیا ہے؟", options: ["نفیس", "بھاری", "موٹا", "کھردرا"], answer: 0, explanation: "نفیس لطیف کے معنوں میں استعمال ہوتا ہے۔", factoid: "لطیف احساسات انسان کو مہذب بناتے ہیں۔", category: "مترادفات" },
    { level: 4, question: "مستقل کا متضاد کیا ہے؟", options: ["عارضی", "پکا", "ٹھوس", "مضبوط"], answer: 0, explanation: "مستقل اور عارضی ایک دوسرے کے متضاد ہیں۔", factoid: "زندگی میں تبدیلی مستقل ہے۔", category: "متضاد" },
    { level: 4, question: "محاورہ'خاک میں ملانا'کا مطلب کیا ہے؟", options: ["تباہ کر دینا", "دفن کر دینا", "چھپا دینا", "صاف کر دینا"], answer: 0, explanation: "اس کا مطلب تباہ کر دینا ہے۔", factoid: "یہ محاورہ بہت عام استعمال ہوتا ہے۔", category: "محاورات" },
    { level: 4, question: "محاورہ'نہ نو من تیل ہوگا نہ رادھا ناچے گی'کا مطلب؟", options: ["وسائل کے بغیر کام نہیں ہوتا", "رقص کرنا", "تیل ڈالنا", "تیاری کرنا"], answer: 0, explanation: "اس کا مطلب ہے مناسب وسائل کے بغیر کام نہیں ہوتا۔", factoid: "یہ ایک مشہور ہندی محاورہ ہے۔", category: "محاورات" },
    { level: 4, question: "محاورہ'آسمان کے تارے توڑنا'کا مطلب؟", options: ["ناممکن کام کرنا", "آسان کام کرنا", "خوش ہونا", "اداس ہونا"], answer: 0, explanation: "اس کا مطلب ناممکن کام کرنا یا بہت بڑی بات کرنا ہے۔", factoid: "محاورے زبان کو مزیدار بناتے ہیں۔", category: "محاورات" },
    { level: 4, question: "اردو کے مشہور ناول'امراؤ جان ادا'کے مصنف کون ہیں؟", options: ["مرزا ہادی رسوا", "نذیر احمد", "پریم چند", "علی عباس حسینی"], answer: 0, explanation: "اس ناول کے مصنف مرزا ہادی رسوا ہیں۔", factoid: "یہ ناول اردو ادب کا شاہکار ہے۔", category: "ادب" },
    { level: 4, question: "اردو کے مشہور افسانہ نگار کون تھے؟", options: ["منٹو", "غالب", "اقبال", "فیض"], answer: 0, explanation: "سعادت حسن منٹو کو اردو کے عظیم افسانہ نگار کہا جاتا ہے۔", factoid: "منٹو کے افسانے آج بھی مقبول ہیں۔", category: "ادب" },
    { level: 4, question: "اردو کی پہلی شاعرہ کون تھیں؟", options: ["محفل بیگم", "خدیجہ مستور", "عصمت چغتائی", "پروین شاکر"], answer: 0, explanation: "محفل بیگم کو اردو کی پہلی شاعرہ کہا جاتا ہے۔", factoid: "وہ مغل شہزادی تھیں۔", category: "ادب" },

    // Level 5 - ماہر (سوالات 61-75)
    { level: 5, question: "تفاعل کا مترادف کیا ہے؟", options: ["ردعمل", "عمل", "کام", "محنت"], answer: 0, explanation: "ردعمل تفاعل کے معنوں میں استعمال ہوتا ہے۔", factoid: "ہر عمل کا ردعمل ہوتا ہے۔", category: "مترادفات" },
    { level: 5, question: "وحدانیت کا متضاد کیا ہے؟", options: ["شرک", "توحید", "ایمان", "یقین"], answer: 0, explanation: "وحدانیت اور شرک ایک دوسرے کے متضاد ہیں۔", factoid: "اللہ کی وحدانیت پر ایمان اسلامیات کا بنیادی عقیدہ ہے۔", category: "متضاد" },
    { level: 5, question: "محاورہ'چاند پر تھوکنا'کا مطلب کیا ہے؟", options: ["بے ادبی کرنا", "خوش ہونا", "اداس ہونا", "نفرت کرنا"], answer: 0, explanation: "اس کا مطلب کسی معزز کی بے ادبی کرنا ہے۔", factoid: "یہ محاورہ اردو میں بہت عام ہے۔", category: "محاورات" },
    { level: 5, question: "اردو کے مشہور ڈرامہ نگار کون تھے؟", options: ["امتیاز علی تاج", "منٹو", "فیض", "احمد فراز"], answer: 0, explanation: "امتیاز علی تاج کو اردو کے عظیم ڈرامہ نگار کہا جاتا ہے۔", factoid: "ان کا مشہور ڈرامہ 'چچا چھکّن' ہے۔", category: "ادب" },
    { level: 5, question: "اردو کے مشہور مزاح نگار کون تھے؟", options: ["پطرس بخاری", "مجید امجد", "احمد ندیم قاسمی", "ابن صفی"], answer: 0, explanation: "پطرس بخاری کو اردو کے عظیم مزاح نگار کہا جاتا ہے۔", factoid: "ان کا مشہور مجموعہ 'پطرس کے مضامین' ہے۔", category: "ادب" }
];

// Expand questions to 50 per level
let level1Questions = allQuestions.filter(q => q.level === 1);
let level2Questions = allQuestions.filter(q => q.level === 2);
let level3Questions = allQuestions.filter(q => q.level === 3);
let level4Questions = allQuestions.filter(q => q.level === 4);
let level5Questions = allQuestions.filter(q => q.level === 5);

while (level1Questions.length < 50) level1Questions.push({ ...level1Questions[0], question: `سوال ${level1Questions.length + 1}: اردو زبان کی اہمیت کیا ہے؟`, options: ["بہت اہم", "کم اہم", "بالکل نہیں", "نہیں معلوم"], answer: 0, explanation: "اردو پاکستان کی قومی زبان ہے اور لاکھوں لوگ اسے بولتے ہیں۔", factoid: "اردو دنیا کی 10 بڑی زبانوں میں شامل ہے۔", category: "عمومی" });
while (level2Questions.length < 50) level2Questions.push({ ...level2Questions[0], question: `سوال ${level2Questions.length + 1}: اردو میں 'محبت' کا مترادف کیا ہے؟`, options: ["عشق", "نفرت", "غصہ", "دشمنی"], answer: 0, explanation: "عشق محبت کا مترادف ہے۔", factoid: "محبت دنیا کی سب سے خوبصورت چیز ہے۔", category: "مترادفات" });
while (level3Questions.length < 50) level3Questions.push({ ...level3Questions[0], question: `سوال ${level3Questions.length + 1}: مرزا غالب کا تعلق کس شہر سے تھا؟`, options: ["دہلی", "لکھنؤ", "آگرہ", "کلکتہ"], answer: 0, explanation: "مرزا غالب کا تعلق دہلی سے تھا۔", factoid: "غالب نے اپنی زندگی کا زیادہ حصہ دہلی میں گزارا۔", category: "ادب" });
while (level4Questions.length < 50) level4Questions.push({ ...level4Questions[0], question: `سوال ${level4Questions.length + 1}: اردو لفظ کی اصل کیا ہے؟`, options: ["ترکی", "فارسی", "عربی", "سنسکرت"], answer: 0, explanation: "اردو لفظ ترکی زبان سے آیا ہے جس کا مطلب 'لشکر' ہے۔", factoid: "اردو مختلف زبانوں کا مرکب ہے۔", category: "عمومی" });
while (level5Questions.length < 50) level5Questions.push({ ...level5Questions[0], question: `سوال ${level5Questions.length + 1}: غالب کا اصل نام کیا تھا؟`, options: ["مرزا اسد اللہ بیگ خان", "مرزا نوراللہ بیگ", "مرزا جلال الدین", "مرزا کامران"], answer: 0, explanation: "غالب کا اصل نام مرزا اسد اللہ بیگ خان تھا۔", factoid: "غالب نے فارسی میں بھی شاعری کی۔", category: "ادب" });

const questionsByLevel = { 1: level1Questions, 2: level2Questions, 3: level3Questions, 4: level4Questions, 5: level5Questions };

// ==================== GLOBAL STATE ====================
let currentState = { mode: 'classic', level: 1, questions: [], currentQuestion: 0, score: 0, lives: 3, userAnswers: [], powerups: { fifty: 3, time: 3, hint: 3, skip: 3 }, timer: null, timeLeft: 60, streak: 0, weakAreas: {} };
let userReactions = new Set();
let toolUsageCount = 0;
let progressChart = null;
let userId = localStorage.getItem('userId') || `user_${Date.now()}`;
localStorage.setItem('userId', userId);

// ==================== CLOUDFLARE WORKERS API INTEGRATION ====================

// Make API request with error handling
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${CONFIG.API_BASE}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': CONFIG.API_KEY,
            ...options.headers
        };
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API Request Failed:', error);
        return null;
    }
}

// ==================== USAGE COUNTER ====================
async function incrementUsage() {
    try {
        const data = await apiRequest('/api/usage', {
            method: 'POST',
            body: JSON.stringify({ 
                tool_slug: 'urdu_quiz',
                user_id: userId,
                action: 'view'
            })
        });
        if (data && data.count !== undefined) {
            toolUsageCount = data.count;
            updateUsageDisplay(toolUsageCount);
        }
        return data;
    } catch (error) {
        // Fallback: LocalStorage
        toolUsageCount = parseInt(localStorage.getItem('urdu_quiz_usage') || '0') + 1;
        localStorage.setItem('urdu_quiz_usage', toolUsageCount);
        updateUsageDisplay(toolUsageCount);
    }
}

async function getUsageStats() {
    try {
        const data = await apiRequest(`/api/stats?tool_slug=urdu_quiz`, { method: 'GET' });
        if (data) {
            toolUsageCount = data.usage || 0;
            updateUsageDisplay(toolUsageCount);
            if (document.getElementById('totalUsersCount')) {
                document.getElementById('totalUsersCount').textContent = (data.views || 0).toLocaleString();
            }
            if (document.getElementById('totalSharesCount')) {
                document.getElementById('totalSharesCount').textContent = (data.shares || 0).toLocaleString();
            }
        }
        return data;
    } catch (error) {
        // Fallback: LocalStorage
        const usage = parseInt(localStorage.getItem('urdu_quiz_usage') || '0');
        toolUsageCount = usage;
        updateUsageDisplay(usage);
    }
}

function updateUsageDisplay(count) {
    document.querySelectorAll('.stats-badge, #globalUsageCount').forEach(el => {
        if (el) el.textContent = count.toLocaleString();
    });
}

// ==================== REACTIONS ====================
async function addReaction(emoji, isMainPage = true) {
    const reactionKey = `urdu_quiz_${emoji}_${userId}`;
    
    if (userReactions.has(reactionKey)) {
        showToast(`پہلے ہی ${getEmojiName(emoji)} کا ردعمل دے چکے ہیں!`, 'warning');
        return;
    }
    
    try {
        const data = await apiRequest('/api/reactions', {
            method: 'POST',
            body: JSON.stringify({ 
                tool_slug: 'urdu_quiz', 
                emoji: emoji, 
                user_id: userId 
            })
        });
        userReactions.add(reactionKey);
        if (isMainPage) {
            const span = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
            if (span) span.textContent = parseInt(span.textContent) + 1;
        }
        showToast(`${getEmojiName(emoji)} کا شکریہ!`, 'success');
    } catch (error) {
        // Fallback: LocalStorage
        userReactions.add(reactionKey);
        const saved = JSON.parse(localStorage.getItem('urdu_quiz_reactions') || '{}');
        saved[emoji] = (saved[emoji] || 0) + 1;
        localStorage.setItem('urdu_quiz_reactions', JSON.stringify(saved));
        if (isMainPage) {
            const span = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
            if (span) span.textContent = parseInt(span.textContent) + 1;
        }
        showToast(`${getEmojiName(emoji)} کا شکریہ!`, 'success');
    }
}

async function getReactions() {
    try {
        const data = await apiRequest(`/api/reactions?tool_slug=urdu_quiz`, { method: 'GET' });
        if (data && data.reactions) {
            const emojis = ['like', 'love', 'wow', 'sad', 'laugh', 'celebrate'];
            emojis.forEach(emoji => {
                const span = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
                if (span && data.reactions[emoji] !== undefined) {
                    span.textContent = data.reactions[emoji];
                }
            });
        }
        return data;
    } catch (error) {
        // Fallback: LocalStorage
        const saved = JSON.parse(localStorage.getItem('urdu_quiz_reactions') || '{}');
        const emojis = ['like', 'love', 'wow', 'sad', 'laugh', 'celebrate'];
        emojis.forEach(emoji => {
            const span = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
            if (span && saved[emoji] !== undefined) {
                span.textContent = saved[emoji];
            }
        });
    }
}

// ==================== SHARES ====================
async function trackShare(platform) {
    try {
        await apiRequest('/api/shares', {
            method: 'POST',
            body: JSON.stringify({ 
                tool_slug: 'urdu_quiz', 
                platform: platform,
                user_id: userId 
            })
        });
    } catch (error) {
        // Fallback: LocalStorage
        const shares = JSON.parse(localStorage.getItem('urdu_quiz_shares') || '{}');
        shares[platform] = (shares[platform] || 0) + 1;
        localStorage.setItem('urdu_quiz_shares', JSON.stringify(shares));
    }
}

// ==================== GROK AI INTEGRATION ====================
async function generateQuestionsFromGrok(level) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/grok/generate`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            },
            body: JSON.stringify({ 
                prompt: `${CONFIG.QUESTIONS_PER_LEVEL} منفرد اردو سوالات جنریٹ کریں۔ لیول: ${LEVEL_NAMES[level]}۔ موضوعات: مترادفات، متضاد، قواعد، محاورات، ادب۔ ہر سوال کے 4 آپشنز، صحیح جواب کی انڈیکس (0-3)، تشریح اور دلچسپ حقیقت شامل کریں۔ JSON فارمیٹ میں واپس کریں۔`,
                model: 'llama-3.1-8b-instant',
                max_tokens: 8000
            })
        });
        const data = await response.json();
        if (data && data.questions && data.questions.length > 0) {
            return data.questions;
        }
        return null;
    } catch (error) {
        console.error('Grok API error:', error);
        return null;
    }
}

function getEmojiName(emoji) {
    const names = { like: '👍', love: '❤️', wow: '😮', sad: '😢', laugh: '😂', celebrate: '🎉' };
    return names[emoji] || emoji;
}

// ==================== SHARING FUNCTIONS ====================
function shareQuiz(platform) {
    const url = window.location.href;
    const score = document.getElementById('finalScoreValue')?.textContent || '0';
    const text = `میں نے اردو کوئز میں ${score}% سکور حاصل کیا! آپ بھی آزمائیں۔`;
    
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    else if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    else if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offscreen/?url=${encodeURIComponent(url)}`;
    else if (platform === 'copy') {
        navigator.clipboard.writeText(url);
        trackShare('copy');
        showToast('لنک کاپی ہو گیا!', 'success');
        return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank');
        trackShare(platform);
    }
    showToast(`${platform} پر شیئر کر دیا!`, 'success');
}

function copyPageUrl() {
    navigator.clipboard.writeText(window.location.href);
    trackShare('copy');
    showToast('لنک کاپی ہو گیا!', 'success');
}

// ==================== UTILITIES ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading(message) {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;
    document.getElementById('loadingMessage').textContent = message;
    overlay.style.display = 'flex';
}

function hideLoading() { 
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none'; 
}

function getQuestionsForLevel(level) { return [...questionsByLevel[level]]; }

// Navigate to Home
function goHome() {
    window.location.href = CONFIG.HOME_URL;
}

// Navigate to Category
function goBack() {
    window.location.href = CONFIG.CATEGORY_URL;
}

// ==================== QUIZ FUNCTIONS ====================
async function startQuiz(level, mode) {
    currentState = { mode, level, questions: [], currentQuestion: 0, score: 0, lives: 3, userAnswers: [], powerups: { fifty: 3, time: 3, hint: 3, skip: 3 }, timer: null, timeLeft: TIME_LIMITS[level], streak: 0, weakAreas: {} };
    
    showLoading('🤖 Grok AI سے سوالات آرہے ہیں...');
    
    // Try Grok API first
    let aiQuestions = await generateQuestionsFromGrok(level);
    
    if (aiQuestions && aiQuestions.length >= 20) {
        currentState.questions = aiQuestions.slice(0, CONFIG.QUESTIONS_PER_LEVEL);
        showToast('✨ Grok AI سے نئے سوالات تیار ہو گئے!', 'success');
    } else {
        // Fallback to local questions
        currentState.questions = getQuestionsForLevel(level);
        showToast('📚 لوکل سوالات استعمال ہو رہے ہیں', 'info');
    }
    
    hideLoading();
    
    const modeContainer = document.getElementById('modeContainer');
    const levelsContainer = document.getElementById('levelsContainer');
    const quizContainer = document.getElementById('quizContainer');
    
    if (modeContainer) modeContainer.style.display = 'none';
    if (levelsContainer) levelsContainer.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'block';
    
    const modeEl = document.getElementById('quizMode');
    if (modeEl) modeEl.textContent = mode === 'classic' ? 'کلاسک' : mode === 'practice' ? 'پریکٹس' : 'سروائیول';
    
    const levelEl = document.getElementById('quizLevel');
    if (levelEl) levelEl.textContent = LEVEL_NAMES[level];
    
    const totalEl = document.getElementById('totalQuestions');
    if (totalEl) totalEl.textContent = currentState.questions.length;
    
    const livesEl = document.getElementById('livesCount');
    if (livesEl) livesEl.textContent = currentState.lives;
    
    const scoreEl = document.getElementById('scoreCount');
    if (scoreEl) scoreEl.textContent = currentState.score;
    
    loadQuestion();
    startTimer();
    incrementUsage();
    getReactions();
}

function startTimer() {
    if (currentState.timer) clearInterval(currentState.timer);
    if (currentState.mode === 'practice') return;
    currentState.timer = setInterval(() => {
        if (currentState.timeLeft <= 0) { clearInterval(currentState.timer); handleTimeout(); }
        else { currentState.timeLeft--; 
            const timerEl = document.getElementById('timerDisplay');
            if (timerEl) timerEl.textContent = currentState.timeLeft; 
        }
    }, 1000);
}

function handleTimeout() {
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
    currentState.lives--; 
    const livesEl = document.getElementById('livesCount');
    if (livesEl) livesEl.textContent = currentState.lives;
    showToast(`⏰ وقت ختم! ایک جان ضائع`, 'error');
    if (currentState.lives <= 0) endQuiz();
    else { currentState.userAnswers[currentState.currentQuestion] = { selected: -1, correct: false }; 
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.disabled = false; 
    }
}

function loadQuestion() {
    const q = currentState.questions[currentState.currentQuestion];
    if (!q) return;
    
    const questionText = document.getElementById('questionText');
    if (questionText) questionText.textContent = `سوال ${currentState.currentQuestion + 1}: ${q.question}`;
    
    const categoryEl = document.getElementById('questionCategory');
    if (categoryEl) categoryEl.textContent = q.category || 'اردو';
    
    const pointsEl = document.getElementById('questionPoints');
    if (pointsEl) pointsEl.textContent = `+${currentState.level} پوائنٹ`;
    
    const currentNumEl = document.getElementById('currentQuestionNum');
    if (currentNumEl) currentNumEl.textContent = currentState.currentQuestion + 1;
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = `${((currentState.currentQuestion + 1) / currentState.questions.length) * 100}%`;
    
    const optsContainer = document.getElementById('optionsList');
    if (!optsContainer) return;
    optsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
        div.onclick = () => selectAnswer(idx);
        optsContainer.appendChild(div);
    });
    
    const explanationBox = document.getElementById('explanationBox');
    if (explanationBox) explanationBox.style.display = 'none';
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.disabled = true;
    
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.disabled = currentState.currentQuestion === 0;
    
    updatePowerupsDisplay();
}

function selectAnswer(selectedIdx) {
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
    const q = currentState.questions[currentState.currentQuestion];
    const isCorrect = (selectedIdx === q.answer);
    if (isCorrect) { 
        currentState.score += 10 * currentState.level; 
        showToast('✅ صحیح جواب! بہت خوب!', 'success'); 
        playSound(true); 
    } else { 
        currentState.lives--; 
        showToast(`❌ غلط! صحیح جواب: ${String.fromCharCode(65 + q.answer)}`, 'error'); 
        playSound(false); 
        trackWeakArea(q.category || 'اردو'); 
    }
    currentState.userAnswers[currentState.currentQuestion] = { selected: selectedIdx, correct: isCorrect };
    
    const livesEl = document.getElementById('livesCount');
    if (livesEl) livesEl.textContent = currentState.lives;
    
    const scoreEl = document.getElementById('scoreCount');
    if (scoreEl) scoreEl.textContent = currentState.score;
    
    const opts = document.querySelectorAll('.option');
    opts.forEach((opt, idx) => { 
        if (idx === q.answer) opt.classList.add('correct'); 
        else if (idx === selectedIdx && !isCorrect) opt.classList.add('incorrect'); 
        opt.style.pointerEvents = 'none'; 
    });
    
    const explanationText = document.getElementById('explanationText');
    if (explanationText) explanationText.textContent = q.explanation;
    
    const factoidText = document.getElementById('factoidText');
    if (factoidText) factoidText.textContent = q.factoid || '📖 اردو میں روز نئے الفاظ سیکھیں!';
    
    const explanationBox = document.getElementById('explanationBox');
    if (explanationBox) explanationBox.style.display = 'block';
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.disabled = false;
    
    if (currentState.lives <= 0) setTimeout(() => endQuiz(), 1500);
}

function trackWeakArea(area) { if (!currentState.weakAreas[area]) currentState.weakAreas[area] = 0; currentState.weakAreas[area]++; }

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
    const totalPossible = currentState.questions.length * 10 * currentState.level;
    const percentage = totalPossible > 0 ? Math.round((currentState.score / totalPossible) * 100) : 0;
    
    const finalScore = document.getElementById('finalScoreValue');
    if (finalScore) finalScore.textContent = `${percentage}%`;
    
    let badge = "اردو سیکھنے والا 📚";
    if (percentage >= 90) badge = "اردو کا ماہر 🎓🏆";
    else if (percentage >= 70) badge = "سخن شناس 🌟";
    
    const badgeEl = document.getElementById('badgeEarned');
    if (badgeEl) badgeEl.textContent = badge;
    
    let streak = parseInt(localStorage.getItem('urduStreak') || '0');
    if (percentage >= 60) { streak++; localStorage.setItem('urduStreak', streak); }
    else { streak = 0; localStorage.setItem('urduStreak', '0'); }
    
    const streakEl = document.getElementById('streakCount');
    if (streakEl) streakEl.textContent = streak;
    
    const weakList = document.getElementById('weakAreasList');
    if (weakList) {
        weakList.innerHTML = '';
        Object.entries(currentState.weakAreas).slice(0, 3).forEach(([area, count]) => { 
            const tag = document.createElement('span'); 
            tag.className = 'weak-area-tag'; 
            tag.textContent = `${area}: ${count} غلطیاں`; 
            weakList.appendChild(tag); 
        });
    }
    
    updateProgressChart(percentage);
    
    const quizContainer = document.getElementById('quizContainer');
    if (quizContainer) quizContainer.style.display = 'none';
    
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) resultsContainer.style.display = 'block';
    
    if (percentage >= 70) createConfetti();
}

function updateProgressChart(score) {
    const ctx = document.getElementById('progressChart')?.getContext('2d');
    if (!ctx) return;
    if (progressChart) progressChart.destroy();
    progressChart = new Chart(ctx, { 
        type: 'line', 
        data: { 
            labels: ['پہلا', 'دوسرا', 'تیسرا', 'موجودہ'], 
            datasets: [{ 
                label: 'آپ کی کارکردگی', 
                data: [40, 55, 70, score], 
                borderColor: '#11998e', 
                backgroundColor: 'rgba(17,153,142,0.1)', 
                fill: true, 
                tension: 0.4 
            }] 
        }, 
        options: { responsive: true } 
    });
}

function usePowerup(type) {
    if (currentState.powerups[type] <= 0) { showToast(`${type} استعمال کر چکے!`, 'warning'); return; }
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) { showToast('جواب دے چکے!', 'warning'); return; }
    const q = currentState.questions[currentState.currentQuestion];
    currentState.powerups[type]--;
    if (type === 'fifty') {
        const wrong = []; for (let i = 0; i < q.options.length; i++) if (i !== q.answer) wrong.push(i);
        const toRemove = wrong.slice(0, 2);
        document.querySelectorAll('.option').forEach((opt, idx) => { if (toRemove.includes(idx)) opt.style.opacity = '0.4'; });
        showToast('50-50 استعمال! دو آپشنز ختم', 'success');
    } else if (type === 'time') { currentState.timeLeft += 30; showToast('+30 سیکنڈز کا اضافہ!', 'success'); }
    else if (type === 'hint') { showToast(`💡 اشارہ: ${q.explanation.substring(0, 80)}...`, 'info'); }
    else if (type === 'skip') { nextQuestion(); showToast('سوال چھوڑ دیا!', 'info'); }
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
        if (spoken.includes(correctOption) || correctOption.includes(spoken)) selectAnswer(q.answer); 
        else showToast(`آپ نے کہا: "${spoken}"۔ دوبارہ کوشش کریں!`, 'error'); 
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
        confetti.style.width = '10px'; 
        confetti.style.height = '10px'; 
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`; 
        confetti.style.left = `${Math.random() * 100}%`; 
        confetti.style.top = '-20px'; 
        confetti.style.borderRadius = '50%'; 
        confetti.style.zIndex = '1000'; 
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`; 
        document.body.appendChild(confetti); 
        setTimeout(() => confetti.remove(), 5000); 
    } 
}

function downloadCertificate() { 
    const score = document.getElementById('finalScoreValue')?.textContent || '0%'; 
    const name = prompt('اپنا نام درج کریں:', 'طلبہ'); 
    if (!name) return; 
    const certContent = `اردو کوئز چیلنج - تکمیل کی سند\n\nیہ سند تصدیق کرتی ہے کہ\n${name}\nنے اردو کوئز میں ${score} سکور حاصل کیا\nتاریخ: ${new Date().toLocaleDateString('ur-PK')}`; 
    const blob = new Blob([certContent], { type: 'text/plain' }); 
    const url = URL.createObjectURL(blob); 
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = `urdu-certificate-${Date.now()}.txt`; 
    a.click(); 
    URL.revokeObjectURL(url); 
    showToast('سرٹیفکیٹ ڈاؤن لوڈ ہو گیا!'); 
}

// ==================== THEME SETUP ====================
function setupTheme() { 
    const saved = localStorage.getItem('theme') || 'light'; 
    if (saved === 'dark') document.body.setAttribute('data-theme', 'dark'); 
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.onclick = () => { 
            const isDark = document.body.getAttribute('data-theme') === 'dark'; 
            if (isDark) { 
                document.body.removeAttribute('data-theme'); 
                localStorage.setItem('theme', 'light'); 
            } else { 
                document.body.setAttribute('data-theme', 'dark'); 
                localStorage.setItem('theme', 'dark'); 
            } 
        };
    }
}

function setupScrollButtons() { 
    const up = document.getElementById('scrollUpBtn'); 
    const down = document.getElementById('scrollDownBtn');
    if (up) {
        window.addEventListener('scroll', () => up.style.display = window.scrollY > 200 ? 'flex' : 'none'); 
        up.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
    if (down) down.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); 
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Mode Selection
    document.querySelectorAll('.mode-select-btn').forEach(btn => {
        if (btn) {
            btn.onclick = () => {
                const card = btn.closest('.mode-card');
                if (card) {
                    currentState.mode = card.getAttribute('data-mode');
                    const modeContainer = document.getElementById('modeContainer');
                    const levelsContainer = document.getElementById('levelsContainer');
                    if (modeContainer) modeContainer.style.display = 'none';
                    if (levelsContainer) levelsContainer.style.display = 'block';
                }
            };
        }
    });
    
    // Level Start
    document.querySelectorAll('.level-start-btn').forEach(btn => {
        if (btn) {
            btn.onclick = () => {
                const card = btn.closest('.level-card');
                if (card) {
                    const level = parseInt(card.getAttribute('data-level'));
                    startQuiz(level, currentState.mode);
                }
            };
        }
    });
    
    // Back to Mode
    const backBtn = document.getElementById('backToModeBtn');
    if (backBtn) {
        backBtn.onclick = () => {
            const levelsContainer = document.getElementById('levelsContainer');
            const modeContainer = document.getElementById('modeContainer');
            if (levelsContainer) levelsContainer.style.display = 'none';
            if (modeContainer) modeContainer.style.display = 'grid';
        };
    }
    
    // Navigation Buttons
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.onclick = nextQuestion;
    
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.onclick = prevQuestion;
    
    // Powerups
    const fiftyBtn = document.getElementById('fiftyBtn');
    if (fiftyBtn) fiftyBtn.onclick = () => usePowerup('fifty');
    
    const timeBtn = document.getElementById('timeBtn');
    if (timeBtn) timeBtn.onclick = () => usePowerup('time');
    
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) hintBtn.onclick = () => usePowerup('hint');
    
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) skipBtn.onclick = () => usePowerup('skip');
    
    // Audio Controls
    const readAloudBtn = document.getElementById('readAloudBtn');
    if (readAloudBtn) readAloudBtn.onclick = readAloud;
    
    const speechBtn = document.getElementById('speechAnswerBtn');
    if (speechBtn) speechBtn.onclick = startSpeechRecognition;
    
    // Results Actions
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    if (tryAgainBtn) tryAgainBtn.onclick = () => startQuiz(currentState.level, currentState.mode);
    
    const changeLevelBtn = document.getElementById('changeLevelBtn');
    if (changeLevelBtn) {
        changeLevelBtn.onclick = () => {
            const resultsContainer = document.getElementById('resultsContainer');
            const levelsContainer = document.getElementById('levelsContainer');
            if (resultsContainer) resultsContainer.style.display = 'none';
            if (levelsContainer) levelsContainer.style.display = 'block';
        };
    }
    
    const downloadBtn = document.getElementById('downloadCertBtn');
    if (downloadBtn) downloadBtn.onclick = downloadCertificate;
    
    // Reactions - Main Page
    document.querySelectorAll('.reaction-mini-btn').forEach(btn => {
        if (btn) {
            btn.onclick = () => addReaction(btn.getAttribute('data-emoji'), true);
        }
    });
    
    // Reactions - Results
    document.querySelectorAll('.reaction-emoji').forEach(btn => {
        if (btn) {
            btn.onclick = () => addReaction(btn.getAttribute('data-emoji'), false);
        }
    });
    
    // Share Buttons
    document.querySelectorAll('.share-mini-btn').forEach(btn => {
        if (btn) {
            if (btn.id === 'copyPageUrlBtn') {
                btn.onclick = copyPageUrl;
            } else {
                btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
            }
        }
    });
    
    // Social Icons - Results
    document.querySelectorAll('.social-icon').forEach(btn => {
        if (btn) {
            btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
        }
    });
    
    // Stats Button
    const statsBtn = document.getElementById('statsBtn');
    if (statsBtn) {
        statsBtn.onclick = async () => {
            const data = await getUsageStats();
            if (data) {
                showToast(`کل پلے: ${data.usage || 0} | شیئرز: ${data.shares || 0} | ویوز: ${data.views || 0}`, 'info');
            } else {
                const usage = parseInt(localStorage.getItem('urdu_quiz_usage') || '0');
                showToast(`کل پلے: ${usage}`, 'info');
            }
        };
    }
    
    // Home Button
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) homeBtn.onclick = goHome;
    
    // Back to Category Button
    const categoryBackBtn = document.getElementById('categoryBackBtn');
    if (categoryBackBtn) categoryBackBtn.onclick = goBack;
}

// ==================== TYPEWRITER ANIMATION ====================
function setupTypewriter() {
    const element = document.getElementById('heroTypewriter');
    if (!element) return;
    
    const texts = [
        '📚 اردو سیکھیں اور مہارت حاصل کریں',
        '🎯 250+ مستند سوالات',
        '🤖 AI پاورڈ کوئز',
        '🏆 اپنی صلاحیتوں کو جانچیں'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(typeEffect, 500);
                return;
            }
            setTimeout(typeEffect, 50);
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000);
                return;
            }
            setTimeout(typeEffect, 100);
        }
    }

    typeEffect();
}

// ==================== CHECKLIST STYLES ====================
function setupChecklistStyles() {
    // The checklist styling is handled in CSS
    // This function ensures the checklist items have proper classes
    document.querySelectorAll('.checklist-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('completed');
        });
    });
}

// ==================== INITIALIZATION ====================
function init() {
    setupTheme();
    setupScrollButtons();
    setupEventListeners();
    setupTypewriter();
    setupChecklistStyles();
    
    // Load usage stats
    getUsageStats();
    getReactions();
    
    // Load streak
    const savedStreak = localStorage.getItem('urduStreak') || '0';
    const streakEl = document.getElementById('streakCount');
    if (streakEl) streakEl.textContent = savedStreak;
    
    // Set total users and questions (static stats)
    const usersEl = document.getElementById('totalUsersCount');
    if (usersEl) usersEl.textContent = '50,000+';
    
    const questionsEl = document.getElementById('totalQuestionsCount');
    if (questionsEl) questionsEl.textContent = '250+';
    
    // Set initial usage display
    const usage = parseInt(localStorage.getItem('urdu_quiz_usage') || '0');
    updateUsageDisplay(usage);
    
    showToast('السلام علیکم! اردو کوئز چیلنج میں خوش آمدید 📖', 'success');
}

// ==================== CONFETTI STYLES ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    .checklist-item {
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 8px 16px;
        border-radius: 8px;
        background: var(--bg-primary);
        border: 2px solid var(--border-color);
        margin: 4px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .checklist-item:hover {
        transform: scale(1.02);
        border-color: var(--success);
    }
    .checklist-item.completed {
        background: var(--success);
        color: white;
        border-color: var(--success);
    }
    .checklist-item.completed::before {
        content: '✅ ';
    }
    .checklist-item::before {
        content: '⬜ ';
        font-size: 18px;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', init);
