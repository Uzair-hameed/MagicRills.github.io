/**
 * ============================================================
 * MAGICRILLS AKHLAQI STORIES - MAIN SCRIPT
 * CLOUDFLARE WORKERS API | LOCALSTORAGE FALLBACK
 * ============================================================
 */

// ---------- CONFIGURATION ----------
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'akhlaqi-stories',
    TOOL_NAME: 'Akhlaqi Stories',
    CATEGORY: 'Kids-Games'
};

// ---------- STORIES DATABASE ----------
const STORIES_DB = {
    easy: [
        { id: 1, story: "ایک دفعہ کا ذکر ہے، ایک چھوٹا بچہ علی اپنی ماں کے ساتھ بازار گیا۔ ماں بہت ساری خریداری کر کے تھک گئی تھی۔ علی نے دیکھا کہ ماں کے ہاتھ میں بہت سارے تھیلے ہیں اور وہ مشکل سے چل پا رہی ہیں۔ علی نے فوراً دوڑ کر ماں سے کہا، اماں جی، میں آپ کی مدد کروں گا۔ اس نے ماں کے کچھ تھیلے اپنے ہاتھ میں لے لیے اور ماں کے ساتھ چلنے لگا۔ راستے میں ایک بوڑھی خاتون نے علی کو دیکھا اور کہا، بہت اچھا لڑکا ہے۔ ماں نے علی کو دعا دی اور کہا بیٹا، تم نے بہت اچھا کیا۔ علی کو بہت خوشی ہوئی کہ اس نے اپنی ماں کی مدد کی۔ اس دن کے بعد علی ہمیشہ اپنی ماں کی مدد کرتا تھا۔", words: ["تھیلے", "مدد", "بوڑھی خاتون", "دعا"], question: "علی نے بازار میں اپنی ماں کی کیسے مدد کی؟", options: ["ماں کے تھیلے اٹھا لیے", "ماں کو تنہا چھوڑ دیا", "ماں سے پیسے مانگے", "ماں کو گھر بھیج دیا"], answer: 0 },
        { id: 2, story: "سارہ اسکول میں اپنی کلاس کی ٹاپ طالبہ تھی۔ ایک دن اس کی کلاس میں ایک نئی لڑکی آیا جس کا نام فاطمہ تھا۔ فاطمہ بہت شرمیلی تھی اور اس کی کوئی دوست نہیں تھی۔ سب بچے فاطمہ کو نظر انداز کر رہے تھے۔ سارہ نے یہ دیکھا تو وہ خود فاطمہ کے پاس گئی اور مسکرا کر کہا، کیا تم میرے ساتھ بیٹھو گی؟ فاطمہ بہت خوش ہوئی۔ سارہ نے فاطمہ کو اپنے دوستوں سے ملایا اور اسے اسکول کی تمام سرگرمیوں میں شامل کیا۔ فاطمہ کی زندگی بدل گئی اور اس نے سارہ کا بہت شکریہ ادا کیا۔ استاد نے سارہ کی تعریف کی اور کہا یہی اچھے اخلاق ہیں۔", words: ["شرمیلی", "نظر انداز", "شامل کیا", "تعریف"], question: "سارہ نے نئی لڑکی فاطمہ کے ساتھ کیسا سلوک کیا؟", options: ["اس سے دوستی کی", "اسے نظر انداز کیا", "اس کا مذاق اڑایا", "اس سے دشمنی کی"], answer: 0 },
        { id: 3, story: "رانا صاحب ایک امیر تاجر تھے۔ ایک دن وہ اپنی گاڑی میں جا رہے تھے کہ انہیں سڑک کنارے ایک غریب بچہ نظر آیا جو بہت رو رہا تھا۔ رانا صاحب نے گاڑی روکی اور بچے کے پاس گئے۔ بچے نے بتایا کہ اس کا پیسوں والا بٹوا کھو گیا ہے اور وہ گھر نہیں جا سکتا۔ رانا صاحب نے بچے کو اپنی گاڑی میں بٹھایا اور اسے گھر چھوڑ دیا۔ اس کے علاوہ انہوں نے بچے کو کھانا بھی کھلایا اور نئے کپڑے بھی دیے۔ بچے کی ماں نے رانا صاحب کا بہت شکریہ ادا کیا۔ رانا صاحب نے کہا، انسانیت کی خدمت سب سے بڑی عبادت ہے۔", words: ["تاجر", "بٹوا", "انسانیت", "عبادت"], question: "رانا صاحب نے غریب بچے کی کونسی مدد کی؟", options: ["گھر چھوڑا اور کھانا دیا", "بچے کو ڈانٹا", "بچے کو پولیس کے حوالے کیا", "بچے کو نظر انداز کیا"], answer: 0 },
        { id: 4, story: "حسن اور اس کا چھوٹا بھائی عامر گھر میں کھیل رہے تھے۔ اچانک عامر کی گیند کھڑکی کے شیشے سے جا کر ٹکرائی اور شیشہ ٹوٹ گیا۔ ماں نے آواز دی، کس نے شیشہ توڑا؟ عامر ڈر گیا اور چپ رہا۔ حسن نے آگے بڑھ کر کہا، اماں جی، میں نے غلطی سے شیشہ توڑ دیا۔ ماں کو پتہ تھا کہ عامر نے توڑا ہے لیکن حسن کی سچائی دیکھ کر بہت خوش ہوئی۔ اس نے حسن کو گلے لگایا اور کہا، بیٹا، سچ بولنا سب سے بڑی خوبی ہے۔ عامر نے بھی سچ بولنے کا عہد کیا اور حسن سے معافی مانگی۔", words: ["کھڑکی", "غلطی", "سچائی", "عہد"], question: "حسن نے شیشہ توڑنے پر کیا کیا؟", options: ["جھوٹ بولا", "چپ رہا", "سچ بول دیا", "بھائی پر الزام لگایا"], answer: 2 },
        { id: 5, story: "زینب اپنی دادی کے ساتھ رہتی تھی۔ دادی بوڑھی اور بیمار تھیں۔ زینب روزانہ صبح جلدی اٹھتی، دادی کے لیے ناشتہ تیار کرتی، ان کی دوائیں دیتی اور انہیں ٹہلانے لے جاتی۔ ایک دن دادی نے زینب سے کہا، بیٹا، تم میری بہت دیکھ بھال کرتی ہو، تمہاری وجہ سے میں خوش ہوں۔ زینب نے کہا، دادی جان، آپ نے مجھے بچپن میں اتنا پیار دیا، اب میری باری ہے۔ پڑوسیوں نے زینب کی تعریف کی اور کہا یہ بچی اپنے بڑوں کی عزت کرنا جانتی ہے۔", words: ["بیمار", "دیکھ بھال", "باری", "عزت"], question: "زینب اپنی دادی کے ساتھ کیسا سلوک کرتی تھی؟", options: ["ان کی خدمت کرتی تھی", "ان کو نظر انداز کرتی تھی", "ان سے جھگڑتی تھی", "گھر سے نکال دیتی تھی"], answer: 0 }
    ],
    medium: [
        { id: 1, story: "امجد اپنی کلاس کا ہوشیار طالب علم تھا۔ امتحانات قریب تھے اور اس کا دوست حمید بہت پریشان تھا کیونکہ وہ پڑھائی میں کمزور تھا۔ حمید نے امجد سے مدد مانگی۔ امجد نے اپنی پڑھائی چھوڑ کر حمید کو روزانہ دو گھنٹے پڑھانا شروع کر دیا۔ امتحان کے نتائج آئے تو امجد نے پھر بھی اچھے نمبر حاصل کیے اور حمید بھی پاس ہو گیا۔ حمید نے امجد کی آنکھوں میں آنسو لے کر شکریہ ادا کیا اور کہا، تم میری زندگی کے سب سے اچھے دوست ہو۔ استاد نے دونوں کی محنت کی تعریف کی۔", words: ["پریشان", "مدد", "شکریہ", "محنت"], question: "امجد نے اپنے دوست حمید کی کیسے مدد کی؟", options: ["اسے پڑھایا", "اس سے لڑائی کی", "اسے نظر انداز کیا", "اس کا پیسے لیا"], answer: 0 },
        { id: 2, story: "نسیم نامی ایک خاتون ہسپتال میں نرس تھیں۔ ایک رات ایک بوڑھا مریض آیا جو بہت بیمار تھا اور اس کا کوئی نہیں تھا۔ نسیم نے اس کی پوری دیکھ بھال کی، دوائیں وقت پر دیں، کھانا کھلایا اور اس کی حوصلہ افزائی کی۔ مریض ٹھیک ہو گیا تو اس نے نسیم کو اپنی بیٹی قرار دیا۔ ہسپتال کے ڈاکٹروں نے نسیم کی خدمات کو سراہا اور کہا یہی حقیقی خدمت خلق ہے۔", words: ["نرس", "مریض", "حوصلہ افزائی", "خدمت خلق"], question: "نسیم نے بوڑھے مریض کے ساتھ کیسا سلوک کیا؟", options: ["بہتر دیکھ بھال کی", "نظر انداز کیا", "برا بھلا کہا", "پیسے مانگے"], answer: 0 },
        { id: 3, story: "قاسم ایک چھوٹے سے گاؤں میں رہتا تھا۔ گاؤں کی مسجد کی چھت لیک ہو گئی تھی اور بارش کا موسم تھا۔ قاسم نے اپنی جیب سے پیسے لگا کر مسجد کی مرمت کروائی۔ جب لوگوں کو پتہ چلا تو وہ بھی آگے آئے اور قاسم کی مدد کی۔ امام صاحب نے قاسم کو دعا دی اور کہا یہ لڑکا نوجوانوں کے لیے مثال ہے۔", words: ["گاؤں", "مرمت", "مثال", "دعا"], question: "قاسم نے مسجد کے لیے کیا کیا؟", options: ["مرمت کروائی", "توڑا", "نظرانداز کیا", "بند کروایا"], answer: 0 },
        { id: 4, story: "شازیہ کا ایک پڑوسی بہت غریب تھا اور اس کے بچے بھوکے رہتے تھے۔ شازیہ ہر روز اپنے کھانے میں سے تھوڑا سا اس پڑوسی کو دے دیتی تھی۔ ایک دن پڑوسی کی بیوی نے شازیہ سے کہا، تم ہمارے لیے اللہ کی رحمت ہو۔ شازیہ نے کہا، ہمیں سب کا خیال رکھنا چاہیے۔ شازیہ کے اس عمل سے پورے محلے میں بھائی چارہ پیدا ہو گیا۔", words: ["غریب", "بھوکے", "رحمت", "بھائی چارہ"], question: "شازیہ نے اپنے غریب پڑوسی کی کس طرح مدد کی؟", options: ["کھانا دیا", "پیسے لیے", "لڑائی کی", "گھر سے نکالا"], answer: 0 },
        { id: 5, story: "عرفان نے سڑک پر ایک بچے کو گرا ہوا بٹوا اٹھایا جس میں بہت سارے پیسے تھے۔ اس نے تھوڑی دیر انتظار کیا تو ایک بوڑھا آدمی آیا جو بٹوا ڈھونڈ رہا تھا۔ عرفان نے فوراً بٹوا اسے واپس کر دیا۔ بوڑھے آدمی نے عرفان کو دعا دی اور کہا آج کے زمانے میں ایسے ایماندار لوگ کم ہیں۔", words: ["بٹوا", "انتظار", "ایماندار", "دعا"], question: "عرفان نے بٹوا ملنے پر کیا کیا؟", options: ["واپس کر دیا", "اپنے پاس رکھ لیا", "پھینک دیا", "کسی اور کو دے دیا"], answer: 0 }
    ],
    hard: [
        { id: 1, story: "پروفیسر انور ایک یونیورسٹی میں پڑھاتے تھے۔ ان کا ایک طالب علم مجاہد تھا جو بہت ذہین تھا لیکن پیسوں کی تنگی کی وجہ سے اس کی تعلیم خطرے میں تھی۔ پروفیسر صاحب نے اپنی تنخواہ سے مجاہد کی فیس ادا کی اور اسے کتابیں بھی دیں۔ مجاہد نے محنت کی اور پہلی پوزیشن حاصل کی۔ جب اس نے پروفیسر صاحب کا شکریہ ادا کرنا چاہا تو انہوں نے کہا، تم جنت میں میرے لیے دعا کرنا۔ یہ استاد کا مقام ہے۔", words: ["تنگی", "فیس", "پوزیشن", "مقام"], question: "پروفیسر انور نے اپنے طالب علم کی کس طرح مدد کی؟", options: ["فیس ادا کی", "نظر انداز کیا", "ڈانٹا", "نکال دیا"], answer: 0 },
        { id: 2, story: "ڈاکٹر عائشہ ایک سرکاری ہسپتال میں کام کرتی تھیں۔ ایک دن ایک غریب عورت اپنے بیمار بچے کو لے کر آئی جس کا دل کا آپریشن ضروری تھا۔ عورت کے پاس پیسے نہیں تھے۔ ڈاکٹر عائشہ نے اپنے پرسنل فنڈز سے آپریشن کروایا اور بچہ ٹھیک ہو گیا۔ عورت نے آنسو بہاتے ہوئے کہا، آپ ہمارے لیے فرشتہ ہیں۔", words: ["آپریشن", "پرسنل فنڈز", "فرشتہ", "غریب"], question: "ڈاکٹر عائشہ نے بچے کے علاج کے لیے کیا کیا؟", options: ["اپنے پیسے لگائے", "انکار کیا", "پیسے مانگے", "دوسرے ہسپتال بھیجا"], answer: 0 },
        { id: 3, story: "حامد ایک بڑی کمپنی کا منیجر تھا۔ اسے پتہ چلا کہ کمپنی میں ایک ملازم کے ساتھ زیادتی ہو رہی ہے۔ حامد نے اس معاملے کو اٹھایا اور انصاف دلایا، چاہے اسے اپنی نوکری ہی کیوں نہ جانا پڑے۔ کمپنی کے مالک نے حامد کی بہادری دیکھی اور اسے پروموٹ کر دیا۔ حامد نے کہا، انصاف سب سے بڑی خوبی ہے۔", words: ["زیادتی", "انصاف", "بہادری", "پروموٹ"], question: "حامد نے اپنے ملازم کے ساتھ انصاف کے لیے کیا کیا؟", options: ["آواز اٹھائی", "چپ رہا", "ملازم کو نکالا", "مالک کے ساتھ مل گیا"], answer: 0 },
        { id: 4, story: "عالیہ ایک سماجی کارکن تھی۔ اس نے اپنے علاقے میں ایک سکول بنوایا جہاں غریب بچے مفت تعلیم حاصل کر سکیں۔ بہت سے لوگوں نے اس کی مخالفت کی لیکن وہ ڈٹی رہی۔ آج اس سکول میں پانچ سو سے زائد بچے تعلیم حاصل کر رہے ہیں اور علاقے میں شرح خواندگی بڑھی ہے۔ عالیہ کو قومی ایوارڈ ملا۔", words: ["سماجی کارکن", "مخالفت", "شرح خواندگی", "ایوارڈ"], question: "عالیہ نے غریب بچوں کے لیے کیا بنوایا؟", options: ["سکول", "ہسپتال", "پارک", "مسجد"], answer: 0 },
        { id: 5, story: "سلمان ایک کامیاب بزنس مین تھا۔ اس نے اپنی کمپنی کا زیادہ منافع ملازمین میں تقسیم کر دیا اور کہا، یہ سب تمہاری محنت کا پھل ہے۔ ملازمین نے سلمان کی تعریف کی اور ان کی وفاداری بڑھ گئی۔ کمپنی نے ریکارڈ منافع کمایا اور سلمان کو بہترین ایمپلائر کا ایوارڈ ملا۔", words: ["بزنس مین", "منافع", "محنت", "ایمپلائر"], question: "سلمان نے اپنا منافع کس میں تقسیم کیا؟", options: ["ملازمین میں", "اپنے پاس رکھا", "خیرات میں دیا", "دوسری کمپنی میں لگایا"], answer: 0 }
    ],
    expert: [
        { id: 1, story: "عارف انجینئرنگ کی ایک بڑی فیکٹری چلاتا تھا۔ ایک دن اسے معلوم ہوا کہ فیکٹری میں استعمال ہونے والا کیمیکل ماحول کے لیے نقصان دہ ہے۔ اس نے لاکھوں کے نقصان کے باوجود وہ کیمیکل استعمال کرنا بند کر دیا اور ماحول دوست طریقہ اپنایا۔ حکومت نے اس کی ستائش کی اور عارف کو ماحولیاتی تحفظ کا ایوارڈ دیا۔", words: ["کیمیکل", "نقصان دہ", "ماحول دوست", "ایوارڈ"], question: "عارف نے ماحول کی بہتری کے لیے کیا اچھا کام کیا؟", options: ["کیمیکل بند کیا", "کیمیکل استعمال جاری رکھا", "فیکٹری بند کر دی", "کیمیکل چھپا دیا"], answer: 0 },
        { id: 2, story: "شمیمہ ایک اسکول کی پرنسپل تھی۔ اس نے اپنے اسکول میں معذور بچوں کے لیے خصوصی کلاسیں شروع کیں۔ ریمپ لگوائے اور خصوصی اسٹاف رکھا۔ بہت سے لوگوں نے کہا یہ پیسے کا ضیاع ہے لیکن شمیمہ نہیں مانی۔ آج اس کے اسکول میں 50 سے زیادہ معذور بچے تعلیم حاصل کر رہے ہیں اور دوسرے اسکول بھی ان کی پیروی کر رہے ہیں۔", words: ["معذور بچے", "خصوصی کلاسیں", "ضیاع", "پیروی"], question: "شمیمہ نے معذور بچوں کے لیے اپنے اسکول میں کیا بنوایا؟", options: ["خصوصی کلاسیں", "نیا کھیل کا میدان", "سوئمنگ پول", "کیفٹیریا"], answer: 0 },
        { id: 3, story: "خالد ایک ایسے علاقے میں رہتا تھا جہاں پانی کی بہت کمی تھی۔ اس نے اپنی تمام جمع پونجی سے ایک کنواں کھدوایا اور لوگوں کو مفت پانی فراہم کیا۔ لوگوں نے خالد کے لیے دعائیں مانگیں۔ خالد نے کہا، پانی زندگی ہے، میں نے اپنی زندگی کا مقصد لوگوں کی خدمت کرنا بنا لیا ہے۔", words: ["جمع پونجی", "کنواں", "خدمت", "زندگی"], question: "خالد نے پانی کی کمی کے مسئلے کے لیے کیا کیا؟", options: ["کنواں کھدوایا", "پانی خریدا", "لوگوں کو بھگایا", "خود بھاگ گیا"], answer: 0 },
        { id: 4, story: "ثریا ایک لیڈی ڈاکٹر تھی۔ وہ دور دراز کے پہاڑی علاقوں میں جاکر مریضوں کا علاج کرتی تھی۔ شدید برفباری میں بھی وہ اپنی ڈیوٹی سے کبھی غافل نہیں ہوتی تھی۔ ایک بار اس نے اپنی جان خطرے میں ڈال کر ایک حاملہ عورت کی زندگی بچائی۔ لوگ اسے اماں ثریا کے نام سے پکارتے ہیں۔", words: ["پہاڑی علاقوں", "برفباری", "حاملہ", "اماں"], question: "ثریا کی کس شعبے میں خدمات ہیں؟", options: ["طب (Medical)", "انجینئرنگ", "زراعت", "تعلیم"], answer: 0 },
        { id: 5, story: "زبیر نے اپنی ماں کی بیماری کے دوران ان کی ہر ممکن خدمت کی۔ نوکری چھوڑ دی، راتیں جاگ کر ان کی دیکھ بھال کی۔ ماں کے انتقال کے بعد زبیر نے اپنی ماں کی یاد میں ایک ہسپتال بنوایا جہاں غریب مریضوں کا مفت علاج ہوتا ہے۔ ہسپتال کا نام انہوں نے اپنی ماں کے نام پر رکھا۔", words: ["بیماری", "خدمت", "انتقال", "ہسپتال"], question: "زبیر نے اپنی ماں کی وفات کے بعد کیا بنوایا؟", options: ["ہسپتال", "سکول", "مسجد", "پارک"], answer: 0 }
    ],
    master: [
        { id: 1, story: "بریگیڈیئر ریاض ایک فوجی افسر تھے۔ ریٹائرمنٹ کے بعد انہوں نے اپنی تمام پنشن غریب بچوں کی تعلیم پر خرچ کر دی۔ انہوں نے اپنے گاؤں میں ایک مدرسہ قائم کیا جہاں بچوں کو دینی اور دنیاوی تعلیم دی جاتی تھی۔ آج اس مدرسے سے ہزاروں بچے تعلیم حاصل کر چکے ہیں اور معاشرے میں اپنا کردار ادا کر رہے ہیں۔ ریاض صاحب نے کہا تعلیم سب سے بڑی دولت ہے۔", words: ["پنشن", "مدرسہ", "دولت", "کردار"], question: "بریگیڈیئر ریاض نے اپنی پنشن کس پر خرچ کی؟", options: ["غریب بچوں کی تعلیم", "اپنے گھر پر", "سیر و تفریح", "گاڑی خریدنے پر"], answer: 0 },
        { id: 2, story: "فوزیہ انٹرنیشنل سطح پر شہرت یافتہ سائنسدان ہیں۔ انہوں نے اپنی ایک ایجاد سے کروڑوں ڈالر کمائے لیکن انہوں نے پیٹنٹ کا حق کسی کمپنی کو نہیں بیچا بلکہ اسے مفت دنیا کے سامنے رکھ دیا تاکہ ہر غریب مریض اس سے فائدہ اٹھا سکے۔ اقوام متحدہ نے انہیں انسانیت کا ہیرو قرار دیا۔ انہوں نے کہا علم انسانیت کی خدمت کے لیے ہے، ذاتی فائدے کے لیے نہیں۔", words: ["سائنسدان", "پیٹنٹ", "ہیرو", "خدمت"], question: "فوزیہ نے اپنی ایجاد کا پیٹنٹ کسے بیچا؟", options: ["کسی کو نہیں بیچا", "ایک بڑی کمپنی کو", "حکومت کو", "دو مختلف کمپنیوں کو"], answer: 0 },
        { id: 3, story: "مولانا طارق ایک بڑے عالم دین تھے۔ انہوں نے اپنی زندگی کا 50 سال مختلف ممالک میں پھیلے ہوئے مسلمانوں کی راہنمائی میں گزارے۔ بڑی بڑی نوکریوں کے آفرز آنے کے باوجود انہوں نے مسجد کی محراب کو ترجیح دی۔ جب ان سے پوچھا گیا تو کہا میرا مقصد آخرت کی کامیابی ہے۔ دنیا کی دولت عارضی ہے۔", words: ["عالم دین", "راہنمائی", "محراب", "عارضی"], question: "مولانا طارق نے 50 سال کس میں گزارے؟", options: ["لوگوں کی راہنمائی میں", "کاروبار میں", "سیاست میں", "تفریح میں"], answer: 0 },
        { id: 4, story: "عائشہ بیگم نے اپنے شوہر کی وفات کے بعد اُن کا کاروبار سنبھالا۔ اس نے ملازمین کی تنخواہیں بڑھائیں، نئے گھر بنوائے اور ان کے بچوں کی تعلیم کا بندوبست کیا۔ ملازمین عائشہ بیگم کو ماں کا درجہ دیتے ہیں۔ کاروبار نے ریکارڈ ترقی کی اور عائشہ بیگم کو بہترین خاتون کاروباری شخصیت کا ایوارڈ ملا۔", words: ["وفات", "تنخواہیں", "بندوبست", "ایوارڈ"], question: "عائشہ بیگم نے اپنے شوہر کی وفات کے بعد کاروبار میں کیا بہتری لائی؟", options: ["ملازمین کی تنخواہیں بڑھائیں", "کاروبار بیچ دیا", "ملازمین نکال دیے", "کاروبار بند کر دیا"], answer: 0 },
        { id: 5, story: "حافظ وسیم نے اپنی زندگی کا ہر لمحہ قرآن پاک کی خدمت میں گزار دیا۔ انہوں نے پاکستان کے دور دراز علاقوں میں جا کر بچوں کو قرآن پاک کی تعلیم دی۔ اپنی تنخواہ کا بیشتر حصہ وہ ان بچوں کے کھانے اور کتابوں پر خرچ کر دیتے تھے۔ آج ان کے ہزاروں شاگرد ہیں جو دنیا میں پھیل کر دین اسلام کی خدمت کر رہے ہیں۔ ان کا کہنا ہے کہ قرآن ہماری زندگی کی رہنما کتاب ہے۔", words: ["خدمت", "دور دراز", "تنخواہ", "شاگرد"], question: "حافظ وسیم نے کس کی خدمت کے لیے اپنی زندگی وقف کر دی؟", options: ["قرآن پاک کی", "سیاست کی", "تجارت کی", "فوج کی"], answer: 0 }
    ]
};

// ---------- GAME STATE ----------
const state = {
    currentLevel: 'easy',
    currentLevelIndex: 0,
    usedStoryIds: { easy: [], medium: [], hard: [], expert: [], master: [] },
    score: 0,
    combo: 0,
    streak: 0,
    badges: 0,
    currentStoryData: null,
    currentQuizActive: false,
    currentCorrectAnswer: 0,
    timer: null,
    timeLeft: 30,
    views: 0,
    usage: 0,
    shares: 0,
    followers: 0,
    reactions: { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 }
};

const LEVELS = ['easy', 'medium', 'hard', 'expert', 'master'];
const REACTION_EMOJIS = [
    { id: 'like', emoji: '👍', label: 'پسند' },
    { id: 'love', emoji: '❤️', label: 'محبت' },
    { id: 'wow', emoji: '😮', label: 'واؤ' },
    { id: 'sad', emoji: '😢', label: 'اداس' },
    { id: 'laugh', emoji: '😂', label: 'ہنسی' },
    { id: 'celebrate', emoji: '🎉', label: 'جشن' }
];

// ---------- DOM REFS ----------
const $ = (id) => document.getElementById(id);
const storyCard = $('storyCard');
const quizCard = $('quizCard');
const resultCard = $('resultCard');
const storyTextDiv = $('storyText');
const vocabListSpan = $('vocabList');
const startQuizBtn = $('startQuizBtn');
const questionTextSpan = $('questionText');
const optionsContainer = $('optionsContainer');
const restartBtn = $('restartBtn');
const nextStoryBtn = $('nextStoryBtn');
const continueBtn = $('continueBtn');
const scoreValueSpan = $('scoreValue');
const comboValueSpan = $('comboValue');
const streakValueSpan = $('streakValue');
const badgeCountSpan = $('badgeCount');
const storyCounterSpan = $('storyCounter');
const totalStoriesSpan = $('totalStories');
const timerBar = $('timerBar');
const timerText = $('timerText');
const resultTitle = $('resultTitle');
const resultMessageDiv = $('resultMessage');
const usageDisplaySpan = $('usageCount');
const viewsDisplaySpan = $('viewsCount');
const sharesDisplaySpan = $('sharesCount');
const followersDisplaySpan = $('followersCount');
const themeToggle = $('themeToggle');
const startLearningBtn = $('startLearningBtn');
const exploreBtn = $('exploreBtn');
const toastContainer = $('toastContainer');

// ---------- API CLIENT ----------
class ApiClient {
    constructor() {
        this.baseUrl = CONFIG.API_BASE;
        this.apiKey = CONFIG.API_KEY;
        this.slug = CONFIG.TOOL_SLUG;
        this.fallback = new LocalStorageFallback();
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers: { ...headers, ...options.headers }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.warn('API call failed, using fallback:', error);
            return this.fallback.handle(endpoint, options);
        }
    }

    incrementUsage() {
        return this.request('/api/usage', {
            method: 'POST',
            body: JSON.stringify({ tool_slug: this.slug })
        });
    }

    addReaction(reactionId) {
        return this.request('/api/reactions', {
            method: 'POST',
            body: JSON.stringify({
                tool_slug: this.slug,
                reaction: reactionId
            })
        });
    }

    recordShare(platform) {
        return this.request('/api/shares', {
            method: 'POST',
            body: JSON.stringify({
                tool_slug: this.slug,
                platform: platform
            })
        });
    }

    getStats() {
        return this.request(`/api/stats?tool_slug=${this.slug}`);
    }

    async getAllStats() {
        try {
            const stats = await this.getStats();
            return stats;
        } catch (error) {
            console.warn('Failed to get stats:', error);
            return this.fallback.getStats();
        }
    }
}

// ---------- LOCALSTORAGE FALLBACK ----------
class LocalStorageFallback {
    constructor() {
        this.prefix = 'magicrills_';
    }

    handle(endpoint, options) {
        const key = this.prefix + CONFIG.TOOL_SLUG;
        let data = JSON.parse(localStorage.getItem(key) || '{}');

        if (endpoint === '/api/usage') {
            data.usage = (data.usage || 0) + 1;
        } else if (endpoint === '/api/reactions') {
            const body = JSON.parse(options.body || '{}');
            data.reactions = data.reactions || {};
            data.reactions[body.reaction] = (data.reactions[body.reaction] || 0) + 1;
        } else if (endpoint === '/api/shares') {
            const body = JSON.parse(options.body || '{}');
            data.shares = (data.shares || 0) + 1;
        }

        localStorage.setItem(key, JSON.stringify(data));
        return { success: true, data: data };
    }

    getStats() {
        const key = this.prefix + CONFIG.TOOL_SLUG;
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        return {
            views: data.views || 0,
            usage: data.usage || 0,
            shares: data.shares || 0,
            followers: data.followers || 0,
            reactions: data.reactions || {}
        };
    }
}

// ---------- API INSTANCE ----------
const api = new ApiClient();

// ---------- TOAST SYSTEM ----------
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    if (type === 'success') {
        toast.style.borderColor = '#22c55e';
    } else if (type === 'error') {
        toast.style.borderColor = '#ef4444';
    } else if (type === 'warning') {
        toast.style.borderColor = '#f59e0b';
    }

    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// ---------- TYPEWRITER EFFECT ----------
function typewriterEffect(element, texts, speed = 80) {
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = texts[index];
        if (!isDeleting) {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, speed);
        } else {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % texts.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, speed / 2);
        }
    }

    type();
}

// ---------- STORY FUNCTIONS ----------
function getRandomStoryForLevel(level) {
    const stories = STORIES_DB[level];
    if (!stories) return null;

    if (!state.usedStoryIds[level]) {
        state.usedStoryIds[level] = [];
    }

    if (state.usedStoryIds[level].length >= stories.length) {
        state.usedStoryIds[level] = [];
        showToast('🎉 تمام کہانیاں مکمل! دوبارہ شروع', 'success');
    }

    const available = stories.filter(s => !state.usedStoryIds[level].includes(s.id));
    if (available.length === 0) return stories[0];

    const selected = available[Math.floor(Math.random() * available.length)];
    state.usedStoryIds[level].push(selected.id);
    return selected;
}

function loadStory() {
    const story = getRandomStoryForLevel(state.currentLevel);
    if (!story) {
        showToast('کہانی لوڈ نہیں ہو سکی!', 'error');
        return;
    }

    state.currentStoryData = story;
    storyTextDiv.textContent = story.story;

    const vocabHtml = story.words.map(w =>
        `<span class="word-chip">${w}</span>`
    ).join('');
    vocabListSpan.innerHTML = vocabHtml;

    const completed = state.usedStoryIds[state.currentLevel].length;
    storyCounterSpan.textContent = completed + 1;
    totalStoriesSpan.textContent = STORIES_DB[state.currentLevel].length;

    // Show story card, hide others
    storyCard.classList.remove('hidden');
    quizCard.classList.add('hidden');
    resultCard.classList.add('hidden');

    // Reset timer
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
    
    // Reset quiz state
    state.currentQuizActive = false;
    state.currentCorrectAnswer = 0;
    
    // Reset timer bar
    timerBar.style.width = '100%';
    timerBar.style.background = 'linear-gradient(90deg, #22c55e, #f59e0b, #ef4444)';
    if (timerText) timerText.textContent = '30s';
    
    // Reset next button
    nextStoryBtn.classList.add('hidden');
    nextStoryBtn.textContent = '⏩ اگلی کہانی';
}

// ---------- QUIZ FUNCTIONS ----------
function startQuiz() {
    if (!state.currentStoryData) {
        showToast('پہلے کہانی لوڈ کریں!', 'error');
        return;
    }

    state.currentCorrectAnswer = state.currentStoryData.answer;
    state.currentQuizActive = true;

    // Hide story, show quiz
    storyCard.classList.add('hidden');
    quizCard.classList.remove('hidden');
    resultCard.classList.add('hidden');

    // Set question
    questionTextSpan.textContent = state.currentStoryData.question;
    optionsContainer.innerHTML = '';

    // Create options
    state.currentStoryData.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = opt;
        div.dataset.index = idx;
        div.onclick = function() {
            checkAnswer(parseInt(this.dataset.index));
        };
        optionsContainer.appendChild(div);
    });

    // Reset timer
    state.timeLeft = 30;
    timerBar.style.width = '100%';
    timerBar.style.background = 'linear-gradient(90deg, #22c55e, #f59e0b, #ef4444)';
    if (timerText) timerText.textContent = '30s';

    // Clear existing timer
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }

    // Start timer
    state.timer = setInterval(() => {
        if (!state.currentQuizActive) {
            clearInterval(state.timer);
            state.timer = null;
            return;
        }
        
        state.timeLeft--;
        const percent = (state.timeLeft / 30) * 100;
        timerBar.style.width = `${percent}%`;
        if (timerText) timerText.textContent = `${state.timeLeft}s`;

        if (state.timeLeft <= 10) {
            timerBar.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
        }

        if (state.timeLeft <= 0) {
            clearInterval(state.timer);
            state.timer = null;
            handleTimeout();
        }
    }, 1000);

    // Hide next button until answered
    nextStoryBtn.classList.add('hidden');
    
    // Increment usage
    api.incrementUsage().then(() => {
        updateStatsUI();
    });
}

function checkAnswer(selected) {
    if (!state.currentQuizActive) return;
    state.currentQuizActive = false;
    
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }

    const correct = (selected === state.currentCorrectAnswer);
    const options = document.querySelectorAll('.option');

    // Disable all options
    options.forEach(opt => {
        opt.onclick = null;
        opt.style.cursor = 'default';
    });

    if (correct) {
        const pointsMap = { easy: 10, medium: 20, hard: 30, expert: 40, master: 50 };
        let points = pointsMap[state.currentLevel] || 10;
        state.combo++;
        state.streak++;
        if (state.combo >= 3) points *= 2;
        state.score += points;

        options[selected].classList.add('correct');
        showToast(`✅ صحیح! +${points} پوائنٹس`, 'success');

        if (state.combo >= 5) {
            state.badges++;
            showToast('🔥 کامبو ماسٹر!', 'success');
        }
    } else {
        state.combo = 0;
        state.streak = 0;
        options[selected].classList.add('wrong');
        options[state.currentCorrectAnswer].classList.add('correct');
        showToast(`❌ غلط! صحیح: ${state.currentStoryData.options[state.currentCorrectAnswer]}`, 'error');
    }

    updateStatsUI();
    
    // Show next button
    nextStoryBtn.classList.remove('hidden');

    const completed = state.usedStoryIds[state.currentLevel].length;
    if (completed >= STORIES_DB[state.currentLevel].length) {
        nextStoryBtn.textContent = '🏆 لیول مکمل - اگلا لیول';
        state.badges += 2;
        showToast(`🎉 ${state.currentLevel.toUpperCase()} لیول مکمل!`, 'success');
        updateStatsUI();
    } else {
        nextStoryBtn.textContent = '⏩ اگلی کہانی';
    }
}

function handleTimeout() {
    state.currentQuizActive = false;
    state.combo = 0;
    state.streak = 0;
    updateStatsUI();

    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.onclick = null;
        opt.style.cursor = 'default';
    });
    
    if (options[state.currentCorrectAnswer]) {
        options[state.currentCorrectAnswer].classList.add('correct');
    }
    
    showToast(`⏰ وقت ختم! صحیح: ${state.currentStoryData.options[state.currentCorrectAnswer]}`, 'warning');
    nextStoryBtn.classList.remove('hidden');
}

function nextStory() {
    const completed = state.usedStoryIds[state.currentLevel].length;
    const total = STORIES_DB[state.currentLevel].length;

    if (completed >= total) {
        if (state.currentLevelIndex + 1 < LEVELS.length) {
            state.currentLevelIndex++;
            state.currentLevel = LEVELS[state.currentLevelIndex];
            showToast(`✨ نیا لیول: ${state.currentLevel.toUpperCase()} شروع! ✨`, 'success');

            document.querySelectorAll('.level-btn').forEach((btn, idx) => {
                btn.classList.toggle('active', idx === state.currentLevelIndex);
            });
        } else {
            showToast('🏆 عظیم! آپ نے پورا گیم مکمل کر لیا! 🏆', 'success');
            resultCard.classList.remove('hidden');
            quizCard.classList.add('hidden');
            storyCard.classList.add('hidden');
            resultTitle.textContent = '🎉 گیم مکمل! 🎉';
            resultMessageDiv.innerHTML = `
                <p style="font-size:1.5rem;">آپ نے تمام ${LEVELS.length} لیولز مکمل کر لیے!</p>
                <p style="font-size:1.2rem; margin-top:10px;">کل سکور: ${state.score}</p>
                <p style="font-size:1.2rem;">بیجز: ${state.badges}</p>
            `;
            continueBtn.onclick = () => location.reload();
            return;
        }
    }
    loadStory();
}

// ---------- UI UPDATE FUNCTIONS ----------
function updateStatsUI() {
    if (scoreValueSpan) scoreValueSpan.textContent = state.score;
    if (comboValueSpan) comboValueSpan.textContent = state.combo;
    if (streakValueSpan) streakValueSpan.textContent = state.streak;
    if (badgeCountSpan) badgeCountSpan.textContent = state.badges;
}

function updateDashboardStats(stats) {
    if (stats) {
        if (viewsDisplaySpan) viewsDisplaySpan.textContent = stats.views || 0;
        if (usageDisplaySpan) usageDisplaySpan.textContent = stats.usage || 0;
        if (sharesDisplaySpan) sharesDisplaySpan.textContent = stats.shares || 0;
        if (followersDisplaySpan) followersDisplaySpan.textContent = stats.followers || 0;
    }
}

// ---------- REACTIONS ----------
function renderReactions() {
    const bar = document.getElementById('reactionsBar');
    if (!bar) return;
    bar.innerHTML = '';

    REACTION_EMOJIS.forEach(r => {
        const btn = document.createElement('button');
        btn.className = 'reaction-btn';
        btn.innerHTML = `
            <span class="reaction-emoji">${r.emoji}</span>
            <span class="reaction-count">${state.reactions[r.id] || 0}</span>
            <span class="reaction-label">${r.label}</span>
        `;
        btn.onclick = () => {
            state.reactions[r.id] = (state.reactions[r.id] || 0) + 1;
            renderReactions();
            api.addReaction(r.id).then(() => {
                showToast(`✨ ${r.label} کا اظہار کیا!`, 'success');
            });
        };
        bar.appendChild(btn);
    });
}

// ---------- SHARE ----------
function renderShares() {
    const panel = document.getElementById('sharePanel');
    if (!panel) return;
    panel.innerHTML = '';

    const platforms = [
        { id: 'facebook', name: 'فیس بک', icon: '📘' },
        { id: 'twitter', name: 'ٹوئٹر', icon: '🐦' },
        { id: 'whatsapp', name: 'واٹس ایپ', icon: '📱' },
        { id: 'linkedin', name: 'لنکڈ ان', icon: '💼' }
    ];

    platforms.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'share-btn';
        btn.innerHTML = `<span class="share-icon">${p.icon}</span> ${p.name}`;
        btn.onclick = () => {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('🌟 اخلاقی کہانیاں - بچوں کے لیے تعلیمی کہانیاں');
            let shareUrl = '';

            switch (p.id) {
                case 'facebook':
                    shareUrl = `https://facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${text}%20${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://linkedin.com/sharing/share-offscreen/?url=${url}`;
                    break;
            }

            window.open(shareUrl, '_blank');
            api.recordShare(p.id).then(() => {
                showToast(`✓ ${p.name} پر شیئر کیا`, 'success');
                updateDashboardStats();
            });
        };
        panel.appendChild(btn);
    });

    // Copy Link
    const copyBtn = document.createElement('button');
    copyBtn.className = 'share-btn';
    copyBtn.innerHTML = '<span class="share-icon">🔗</span> کاپی لنک';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('✅ لنک کاپی ہو گیا!', 'success');
        });
    };
    panel.appendChild(copyBtn);
}

// ---------- CHECKLIST ----------
function initChecklist() {
    const items = document.querySelectorAll('.checklist-item');
    items.forEach(item => {
        const toggle = item.querySelector('.checklist-toggle');
        if (toggle) {
            toggle.onclick = () => {
                const checked = item.dataset.checked === 'true';
                item.dataset.checked = (!checked).toString();
                toggle.textContent = checked ? '✔️' : '✅';
                if (!checked) {
                    showToast('✅ کام مکمل!', 'success');
                }
            };
        }
    });
}

// ---------- THEME TOGGLE ----------
function toggleTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeToggle.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
}

// ---------- LEVEL CHANGE ----------
function changeLevel(level, idx) {
    if (idx > state.currentLevelIndex + 1) {
        showToast('پہلے پچھلا لیول مکمل کریں!', 'error');
        return;
    }

    state.currentLevel = level;
    state.currentLevelIndex = idx;
    
    // Clear any existing timer
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
    
    loadStory();

    document.querySelectorAll('.level-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === idx);
    });

    showToast(`🌟 ${level.toUpperCase()} لیول منتخب`, 'info');
}

// ---------- INITIALIZATION ----------
async function init() {
    // Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
    }

    // Typewriter
    const typewriterEl = document.getElementById('typewriterText');
    if (typewriterEl) {
        const typewriterTexts = [
            '📖 اخلاقی کہانیاں سیکھیں',
            '🌟 اچھے اخلاق اپنائیں',
            '🎯 انٹرایکٹو کوئز کھیلیں',
            '🧠 بچوں کی ذہنی نشوونما'
        ];
        typewriterEffect(typewriterEl, typewriterTexts);
    }

    // Load stats
    try {
        const stats = await api.getAllStats();
        updateDashboardStats(stats);
        if (stats.reactions) {
            state.reactions = { ...state.reactions, ...stats.reactions };
        }
    } catch (error) {
        console.warn('Failed to load stats:', error);
        const fallbackStats = new LocalStorageFallback().getStats();
        updateDashboardStats(fallbackStats);
        state.reactions = { ...state.reactions, ...fallbackStats.reactions };
    }

    // Render UI
    renderReactions();
    renderShares();
    initChecklist();

    // Set total stories
    totalStoriesSpan.textContent = STORIES_DB.easy.length;

    // Load first story
    loadStory();
    updateStatsUI();

    // ---------- EVENT LISTENERS ----------
    
    // Start Quiz Button
    if (startQuizBtn) {
        startQuizBtn.onclick = startQuiz;
    }

    // Restart Button
    if (restartBtn) {
        restartBtn.onclick = () => {
            if (state.timer) {
                clearInterval(state.timer);
                state.timer = null;
            }
            state.currentQuizActive = false;
            loadStory();
        };
    }

    // Next Story Button
    if (nextStoryBtn) {
        nextStoryBtn.onclick = nextStory;
    }

    // Continue Button
    if (continueBtn) {
        continueBtn.onclick = () => {
            nextStory();
            resultCard.classList.add('hidden');
        };
    }

    // Theme Toggle
    if (themeToggle) {
        themeToggle.onclick = toggleTheme;
    }

    // Level Buttons
    document.querySelectorAll('.level-btn').forEach((btn, idx) => {
        btn.onclick = () => changeLevel(btn.dataset.level, idx);
    });

    // Hero Buttons
    if (startLearningBtn) {
        startLearningBtn.onclick = () => {
            document.querySelector('.game-area')?.scrollIntoView({ behavior: 'smooth' });
        };
    }

    if (exploreBtn) {
        exploreBtn.onclick = () => {
            showToast('📖 تمام کہانیاں دریافت کریں!', 'info');
        };
    }

    // Auto-increment usage on load
    api.incrementUsage().then(() => {
        updateDashboardStats();
    });

    // Handle visibility change to update stats
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            api.getAllStats().then(stats => {
                updateDashboardStats(stats);
            });
        }
    });

    console.log('✅ MagicRills Akhlaqi Stories initialized successfully!');
}

// ---------- START ----------
document.addEventListener('DOMContentLoaded', init);
