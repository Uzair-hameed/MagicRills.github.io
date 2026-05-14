// ============================================
// methods.js
// 25 Methods for Urdu Jor Tor (Joining/Breaking)
// Complete with Image Integration from Google Drive
// ============================================

// ==================== METHODS DATABASE ====================
const METHODS_DATABASE = [
    {
        id: 1,
        name: "حرف بہ حرف جوڑنا",
        icon: "🔤",
        category: "basic",
        difficulty: "easy",
        description: "تصاویر کے ساتھ حروف کو الگ الگ پہچانیں اور جوڑنا سیکھیں",
        instructions: "ہر حرف کی تصویر دیکھیں، اسے پہچانیں، پھر اگلے حرف کے ساتھ جوڑیں",
        imageRequired: true,
        execute: function() {
            return {
                type: "letter_by_letter",
                title: "حرف بہ حرف جوڑنا",
                content: "حروف کو تصاویر کے ساتھ جوڑیں"
            };
        }
    },
    {
        id: 2,
        name: "تصویر دیکھ کر لفظ بنانا",
        icon: "🖼️",
        category: "visual",
        difficulty: "easy",
        description: "تصویر دیکھیں اور اس کے نام کے حروف کو صحیح ترتیب میں لگائیں",
        instructions: "دی گئی تصویر کو دیکھیں، نیچے دیے گئے حروف کو ترتیب دے کر لفظ بنائیں",
        imageRequired: true,
        execute: function(imageUrl, correctWord) {
            return {
                type: "build_from_image",
                title: "تصویر دیکھ کر لفظ بنائیں",
                image: imageUrl,
                correctAnswer: correctWord,
                content: "تصویر کے مطابق حروف ترتیب دیں"
            };
        }
    },
    {
        id: 3,
        name: "شروع کا حرف پہچاننا",
        icon: "🔍",
        category: "recognition",
        difficulty: "easy",
        description: "تصویر دیکھ کر بتائیں کہ اس کے نام کا پہلا حرف کون سا ہے",
        instructions: "تصویر دیکھیں اور تین آپشنز میں سے صحیح پہلا حرف منتخب کریں",
        imageRequired: true,
        execute: function(imageUrl, correctLetter, options) {
            return {
                type: "first_letter",
                title: "شروع کا حرف پہچانیں",
                image: imageUrl,
                correctAnswer: correctLetter,
                options: options,
                content: "اس تصویر کے نام کا پہلا حرف کیا ہے؟"
            };
        }
    },
    {
        id: 4,
        name: "آخری حرف پہچاننا",
        icon: "🔚",
        category: "recognition",
        difficulty: "easy",
        description: "تصویر دیکھ کر بتائیں کہ اس کے نام کا آخری حرف کون سا ہے",
        instructions: "تصویر دیکھیں اور بتائیں کہ لفظ کے آخر میں کون سا حرف آتا ہے",
        imageRequired: true,
        execute: function(imageUrl, word, lastLetter, options) {
            return {
                type: "last_letter",
                title: "آخری حرف پہچانیں",
                image: imageUrl,
                word: word,
                correctAnswer: lastLetter,
                options: options,
                content: `لفظ "${word}" کا آخری حرف کیا ہے؟`
            };
        }
    },
    {
        id: 5,
        name: "مکسڈ اپ حروف ترتیب دینا",
        icon: "🔄",
        category: "arrangement",
        difficulty: "medium",
        description: "بکھرے ہوئے حروف کو صحیح ترتیب میں لگا کر لفظ بنائیں",
        instructions: "نیچے دیے گئے مکسڈ حروف کو صحیح ترتیب میں لگائیں",
        imageRequired: true,
        execute: function(imageUrl, correctWord, shuffledLetters) {
            return {
                type: "rearrange",
                title: "بکھرے حروف ترتیب دیں",
                image: imageUrl,
                correctAnswer: correctWord,
                shuffledLetters: shuffledLetters,
                content: "حروف کو صحیح ترتیب میں لگائیں"
            };
        }
    },
    {
        id: 6,
        name: "ملتے جلتے حروف میں فرق",
        icon: "⚖️",
        category: "discrimination",
        difficulty: "medium",
        description: "س، ش، ز، ذ، ط، ظ جیسے ملتے جلتے حروف میں فرق کرنا سیکھیں",
        instructions: "دی گئی تصویر دیکھیں اور بتائیں کہ کون سا حرف صحیح ہے",
        imageRequired: true,
        execute: function(similarPairs) {
            return {
                type: "similar_letters",
                title: "ملتے جلتے حروف میں فرق کریں",
                pairs: similarPairs,
                content: "ان حروف میں فرق پہچانیں"
            };
        }
    },
    {
        id: 7,
        name: "فلیش کارڈز",
        icon: "🃏",
        category: "flashcard",
        difficulty: "easy",
        description: "تصویری فلیش کارڈز کے ذریعے حروف اور الفاظ کی مشق کریں",
        instructions: "اگلا بٹن دبائیں، تصویر دیکھیں اور حرف/لفظ پہچانیں",
        imageRequired: true,
        execute: function(flashcards) {
            return {
                type: "flashcard",
                title: "تصویری فلیش کارڈز",
                cards: flashcards,
                content: "اگلا دبائیں اور سیکھتے جائیں"
            };
        }
    },
    {
        id: 8,
        name: "خالی جگہ پر کریں",
        icon: "❓",
        category: "fill_blank",
        difficulty: "medium",
        description: "لفظ میں غائب حرف کو صحیح جگہ پر لگائیں",
        instructions: "تصویر دیکھیں، لفظ میں خالی جگہ پر صحیح حرف لگائیں",
        imageRequired: true,
        execute: function(imageUrl, wordWithBlank, missingLetter, options) {
            return {
                type: "fill_blank",
                title: "خالی جگہ پر کریں",
                image: imageUrl,
                wordWithBlank: wordWithBlank,
                correctAnswer: missingLetter,
                options: options,
                content: `لفظ "${wordWithBlank}" میں غائب حرف کون سا ہے؟`
            };
        }
    },
    {
        id: 9,
        name: "چھپی ہوئی تصویر",
        icon: "🎁",
        category: "reveal",
        difficulty: "hard",
        description: "حروف کو صحیح ترتیب میں جوڑیں تو تصویر کھل جائے گی",
        instructions: "حروف کو صحیح ترتیب میں لگائیں، ہر صحیح جوڑ پر تصویر کا کچھ حصہ کھلے گا",
        imageRequired: true,
        execute: function(targetWord, finalImageUrl) {
            return {
                type: "reveal_picture",
                title: "حروف جوڑیں، تصویر کھلے گی",
                targetWord: targetWord,
                finalImage: finalImageUrl,
                content: "صحیح ترتیب سے حروف لگائیں"
            };
        }
    },
    {
        id: 10,
        name: "میچنگ گیم",
        icon: "🎯",
        category: "matching",
        difficulty: "medium",
        description: "تصویر کو اس کے صحیح لفظ یا حرف سے جوڑیں",
        instructions: "بائیں جانب کی تصویر کو دائیں جانب کے صحیح لفظ سے match کریں",
        imageRequired: true,
        execute: function(items) {
            return {
                type: "matching",
                title: "تصویر کو لفظ سے جوڑیں",
                items: items,
                content: "صحیح جوڑا بنائیں"
            };
        }
    },
    {
        id: 11,
        name: "دو حرفی الفاظ",
        icon: "🔡",
        category: "basic",
        difficulty: "easy",
        description: "صرف دو حروف سے بننے والے الفاظ کی مشق کریں",
        instructions: "تصویر دیکھیں اور دو حرفی لفظ بنائیں",
        imageRequired: true,
        execute: function() {
            return {
                type: "two_letter_words",
                title: "دو حرفی الفاظ بنائیں",
                content: "تصویر دیکھ کر دو حرفی لفظ بنائیں"
            };
        }
    },
    {
        id: 12,
        name: "تین حرفی الفاظ",
        icon: "🔠",
        category: "basic",
        difficulty: "easy",
        description: "تین حروف سے بننے والے الفاظ کی مشق کریں",
        instructions: "تصویر دیکھیں اور تین حرفی لفظ بنائیں",
        imageRequired: true,
        execute: function() {
            return {
                type: "three_letter_words",
                title: "تین حرفی الفاظ بنائیں",
                content: "تصویر دیکھ کر تین حرفی لفظ بنائیں"
            };
        }
    },
    {
        id: 13,
        name: "آواز سنا کر جوڑنا",
        icon: "🎧",
        category: "audio",
        difficulty: "medium",
        description: "آواز سن کر حروف کو ترتیب دیں اور لفظ بنائیں",
        instructions: "آواز سنیں، پھر حروف کو صحیح ترتیب میں لگائیں",
        imageRequired: false,
        execute: function(audioUrl, correctWord) {
            return {
                type: "audio_joining",
                title: "آواز سن کر لفظ بنائیں",
                audio: audioUrl,
                correctAnswer: correctWord,
                content: "آواز سنیں اور لفظ بنائیں"
            };
        }
    },
    {
        id: 14,
        name: "ابتدائی، وسطی، آخری شکل",
        icon: "🎨",
        category: "shapes",
        difficulty: "hard",
        description: "حروف کی مختلف شکلوں کو پہچانیں (ابتدائی، وسطی، آخری)",
        instructions: "حرف کی تینوں شکلیں دیکھیں اور ان میں فرق کریں",
        imageRequired: true,
        execute: function(letter, forms) {
            return {
                type: "letter_forms",
                title: "حروف کی شکلیں پہچانیں",
                letter: letter,
                forms: forms,
                content: `حرف "${letter}" کی تینوں شکلیں دیکھیں`
            };
        }
    },
    {
        id: 15,
        name: "ٹوٹے حروف کو جوڑنا",
        icon: "🧩",
        category: "puzzle",
        difficulty: "hard",
        description: "ٹوٹے ہوئے حروف کے ٹکڑوں کو جوڑ کر مکمل حرف بنائیں",
        instructions: "حروف کے ٹکڑوں کو صحیح ترتیب میں رکھیں",
        imageRequired: true,
        execute: function(letterParts, completeLetter) {
            return {
                type: "broken_letters",
                title: "ٹوٹے حروف جوڑیں",
                parts: letterParts,
                completeLetter: completeLetter,
                content: "حروف کے ٹکڑوں کو جوڑیں"
            };
        }
    },
    {
        id: 16,
        name: "دائیں سے بائیں جوڑنا",
        icon: "➡️",
        category: "directional",
        difficulty: "medium",
        description: "اردو کے اصول کے مطابق دائیں سے بائیں حروف جوڑنا سیکھیں",
        instructions: "حروف کو دائیں سے بائیں ترتیب میں لگائیں",
        imageRequired: false,
        execute: function() {
            return {
                type: "rtl_joining",
                title: "دائیں سے بائیں جوڑیں",
                content: "اردو قاعدہ: دائیں ← بائیں"
            };
        }
    },
    {
        id: 17,
        name: "بغیر ملاوٹ والے حروف",
        icon: "🚫",
        category: "special",
        difficulty: "medium",
        description: "ا، د، ذ، ر، ز، و جیسے بغیر ملاوٹ والے حروف کو پہچانیں",
        instructions: "ان حروف کو پہچانیں جو اگلے حرف سے نہیں ملتے",
        imageRequired: true,
        execute: function() {
            return {
                type: "non_connectors",
                title: "بغیر ملاوٹ والے حروف",
                letters: ['ا', 'د', 'ذ', 'ر', 'ز', 'و'],
                content: "یہ حروف اگلے حرف سے نہیں ملتے"
            };
        }
    },
    {
        id: 18,
        name: "مکمل ملاوٹ والے حروف",
        icon: "🔗",
        category: "special",
        difficulty: "medium",
        description: "ب، پ، ت، ٹ، ج، چ جیسے ملاوٹ والے حروف کی مشق کریں",
        instructions: "ان حروف کو پہچانیں جو دونوں طرف سے ملتے ہیں",
        imageRequired: true,
        execute: function() {
            return {
                type: "connectors",
                title: "مکمل ملاوٹ والے حروف",
                letters: ['ب', 'پ', 'ت', 'ٹ', 'ج', 'چ'],
                content: "یہ حروف دونوں طرف سے ملتے ہیں"
            };
        }
    },
    {
        id: 19,
        name: "ڈریگ اینڈ ڈراپ",
        icon: "🖱️",
        category: "interactive",
        difficulty: "easy",
        description: "حروف کو گھسیٹ کر لفظ بنائیں",
        instructions: "حروف کو ماؤس یا انگلی سے گھسیٹ کر صحیح جگہ پر رکھیں",
        imageRequired: true,
        execute: function() {
            return {
                type: "drag_drop",
                title: "ڈریگ اینڈ ڈراپ سے لفظ بنائیں",
                content: "حروف کو گھسیٹ کر رکھیں"
            };
        }
    },
    {
        id: 20,
        name: "ٹائپ کر کے جوڑنا",
        icon: "⌨️",
        category: "typing",
        difficulty: "hard",
        description: "کی بورڈ سے حروف ٹائپ کر کے لفظ بنائیں",
        instructions: "تصویر دیکھیں اور کی بورڈ سے لفظ ٹائپ کریں",
        imageRequired: true,
        execute: function() {
            return {
                type: "typing",
                title: "ٹائپ کر کے لفظ بنائیں",
                content: "اردو کی بورڈ سے ٹائپ کریں"
            };
        }
    },
    {
        id: 21,
        name: "پزل کے ذریعے",
        icon: "🧩",
        category: "puzzle",
        difficulty: "hard",
        description: "پزل کے ٹکڑوں کو جوڑ کر لفظ بنائیں",
        instructions: "پزل کے ٹکڑوں کو صحیح ترتیب میں رکھیں",
        imageRequired: true,
        execute: function() {
            return {
                type: "puzzle",
                title: "پزل حل کریں",
                content: "پزل ٹکڑوں کو جوڑیں"
            };
        }
    },
    {
        id: 22,
        name: "جملہ سازی",
        icon: "📝",
        category: "advanced",
        difficulty: "hard",
        description: "الفاظ سے چھوٹے چھوٹے جملے بنانا سیکھیں",
        instructions: "دیے گئے الفاظ کو ترتیب دے کر جملہ بنائیں",
        imageRequired: false,
        execute: function() {
            return {
                type: "sentence_making",
                title: "جملہ بنائیں",
                content: "الفاظ کو ترتیب دے کر جملہ بنائیں"
            };
        }
    },
    {
        id: 23,
        name: "سلیبس بنانا",
        icon: "🎵",
        category: "phonetic",
        difficulty: "medium",
        description: "آواز والے حصوں (سلیبس) کو الگ کرنا اور جوڑنا سیکھیں",
        instructions: "لفظ کو آواز والے حصوں میں توڑیں اور پھر جوڑیں",
        imageRequired: false,
        execute: function() {
            return {
                type: "syllables",
                title: "سلیبس بنائیں",
                content: "لفظ کو آواز والے حصوں میں تقسیم کریں"
            };
        }
    },
    {
        id: 24,
        name: "حرف کی آواز کی مشق",
        icon: "🗣️",
        category: "pronunciation",
        difficulty: "easy",
        description: "ہر حرف کی صحیح آواز (تلفظ) کے ساتھ مشق کریں",
        instructions: "حرف دیکھیں، اس کی آواز سنیں، اور دہرائیں",
        imageRequired: true,
        execute: function(letter, audioUrl) {
            return {
                type: "pronunciation",
                title: "حرف کی آواز سیکھیں",
                letter: letter,
                audio: audioUrl,
                content: `حرف "${letter}" کی صحیح آواز سنیں`
            };
        }
    },
    {
        id: 25,
        name: "تصویری ورک شیٹ",
        icon: "📄",
        category: "printable",
        difficulty: "easy",
        description: "پرنٹ ایبل ورک شیٹس کے ذریعے مشق کریں",
        instructions: "ورک شیٹ ڈاؤن لوڈ کریں، پرنٹ کریں، اور مشق کریں",
        imageRequired: true,
        execute: function() {
            return {
                type: "worksheet",
                title: "تصویری ورک شیٹ",
                content: "ورک شیٹ ڈاؤن لوڈ کریں",
                printable: true
            };
        }
    }
];

// ==================== METHOD HELPER FUNCTIONS ====================

// Get all methods
function getAllMethods() {
    return METHODS_DATABASE;
}

// Get method by ID
function getMethodById(id) {
    return METHODS_DATABASE.find(method => method.id === id);
}

// Get methods by category
function getMethodsByCategory(category) {
    return METHODS_DATABASE.filter(method => method.category === category);
}

// Get methods by difficulty
function getMethodsByDifficulty(difficulty) {
    return METHODS_DATABASE.filter(method => method.difficulty === difficulty);
}

// Get methods that require images
function getMethodsWithImages() {
    return METHODS_DATABASE.filter(method => method.imageRequired === true);
}

// Get methods without images
function getMethodsWithoutImages() {
    return METHODS_DATABASE.filter(method => method.imageRequired === false);
}

// Get random method
function getRandomMethod() {
    const randomIndex = Math.floor(Math.random() * METHODS_DATABASE.length);
    return METHODS_DATABASE[randomIndex];
}

// Get methods count by category
function getMethodsStats() {
    const stats = {
        total: METHODS_DATABASE.length,
        withImages: METHODS_DATABASE.filter(m => m.imageRequired).length,
        withoutImages: METHODS_DATABASE.filter(m => !m.imageRequired).length,
        byCategory: {},
        byDifficulty: { easy: 0, medium: 0, hard: 0 }
    };
    
    METHODS_DATABASE.forEach(method => {
        stats.byCategory[method.category] = (stats.byCategory[method.category] || 0) + 1;
        stats.byDifficulty[method.difficulty]++;
    });
    
    return stats;
}

// Execute method with parameters
function executeMethod(methodId, params = {}) {
    const method = getMethodById(methodId);
    if (!method) {
        return { success: false, error: "Method not found" };
    }
    
    try {
        const result = method.execute(params.imageUrl, params.correctWord, params.options);
        return { success: true, method: method, result: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ==================== EXPORT FOR USE ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        METHODS_DATABASE,
        getAllMethods,
        getMethodById,
        getMethodsByCategory,
        getMethodsByDifficulty,
        getMethodsWithImages,
        getMethodsWithoutImages,
        getRandomMethod,
        getMethodsStats,
        executeMethod
    };
}

// For browser usage
if (typeof window !== 'undefined') {
    window.MethodsDB = {
        METHODS_DATABASE,
        getAllMethods,
        getMethodById,
        getMethodsByCategory,
        getMethodsByDifficulty,
        getMethodsWithImages,
        getMethodsWithoutImages,
        getRandomMethod,
        getMethodsStats,
        executeMethod
    };
}

// ==================== METHODS SUMMARY ====================
console.log("✅ Methods.js loaded successfully!");
console.log(`📊 Total Methods: ${METHODS_DATABASE.length}`);
console.log(`🖼️ Methods with Images: ${METHODS_DATABASE.filter(m => m.imageRequired).length}`);
console.log(`📄 Methods without Images: ${METHODS_DATABASE.filter(m => !m.imageRequired).length}`);
