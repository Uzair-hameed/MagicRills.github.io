// ============================================
// ULTIMATE FRACTION GAMES - CLOUDFLARE WORKERS API
// ============================================

// ✅ Configuration
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'magicrills-fraction-ultimate',
    TOTAL_QUESTIONS: 12
};

// ✅ User ID
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
    localStorage.setItem('userId', userId);
}

// ✅ Game State
let state = {
    mode: 'matching',
    level: 'easy',
    score: 0,
    questionIndex: 0,
    streak: 0,
    bestStreak: 0,
    timeElapsed: 0,
    gameActive: true,
    soundEnabled: true,
    currentAnswer: null,
    totalQuestions: CONFIG.TOTAL_QUESTIONS
};

// ✅ Question Bank (12 unique questions per mode & level)
const QUESTION_BANK = {
    compare: {
        easy: [
            { left: "1/2", right: "1/3", answer: ">" },
            { left: "1/4", right: "1/2", answer: "<" },
            { left: "2/3", right: "1/3", answer: ">" },
            { left: "1/2", right: "2/4", answer: "=" },
            { left: "3/4", right: "1/2", answer: ">" },
            { left: "1/3", right: "1/4", answer: ">" },
            { left: "2/4", right: "1/2", answer: "=" },
            { left: "1/5", right: "1/3", answer: "<" },
            { left: "3/6", right: "1/2", answer: "=" },
            { left: "2/5", right: "1/2", answer: "<" },
            { left: "3/8", right: "1/2", answer: "<" },
            { left: "5/8", right: "1/2", answer: ">" }
        ],
        medium: [
            { left: "2/5", right: "3/8", answer: ">" },
            { left: "5/6", right: "3/4", answer: ">" },
            { left: "4/7", right: "2/3", answer: "<" },
            { left: "3/5", right: "1/2", answer: ">" },
            { left: "5/8", right: "3/5", answer: ">" },
            { left: "2/3", right: "5/8", answer: ">" },
            { left: "4/9", right: "1/2", answer: "<" },
            { left: "7/12", right: "1/2", answer: ">" },
            { left: "5/9", right: "4/7", answer: ">" },
            { left: "3/7", right: "2/5", answer: ">" },
            { left: "8/15", right: "1/2", answer: ">" },
            { left: "7/15", right: "1/2", answer: "<" }
        ],
        hard: [
            { left: "2/9", right: "1/4", answer: "<" },
            { left: "7/10", right: "3/4", answer: "<" },
            { left: "11/20", right: "1/2", answer: ">" },
            { left: "5/12", right: "2/5", answer: ">" },
            { left: "7/9", right: "3/4", answer: ">" },
            { left: "4/11", right: "1/3", answer: ">" },
            { left: "9/16", right: "5/8", answer: "<" },
            { left: "13/20", right: "3/5", answer: ">" },
            { left: "8/15", right: "5/9", answer: ">" },
            { left: "7/12", right: "9/16", answer: ">" },
            { left: "11/18", right: "3/5", answer: ">" },
            { left: "13/25", right: "1/2", answer: ">" }
        ],
        expert: [
            { left: "13/24", right: "1/2", answer: ">" },
            { left: "17/32", right: "1/2", answer: ">" },
            { left: "19/36", right: "1/2", answer: ">" },
            { left: "23/48", right: "1/2", answer: "<" },
            { left: "29/64", right: "1/2", answer: "<" },
            { left: "31/64", right: "1/2", answer: "<" },
            { left: "15/28", right: "1/2", answer: ">" },
            { left: "21/40", right: "1/2", answer: ">" },
            { left: "25/48", right: "1/2", answer: ">" },
            { left: "27/50", right: "1/2", answer: ">" },
            { left: "33/64", right: "1/2", answer: ">" },
            { left: "35/72", right: "1/2", answer: "<" }
        ]
    },
    simplify: {
        easy: [
            { question: "2/4", answer: "1/2" }, { question: "3/6", answer: "1/2" }, { question: "4/8", answer: "1/2" },
            { question: "2/6", answer: "1/3" }, { question: "4/12", answer: "1/3" }, { question: "3/9", answer: "1/3" },
            { question: "6/8", answer: "3/4" }, { question: "9/12", answer: "3/4" }, { question: "5/10", answer: "1/2" },
            { question: "8/12", answer: "2/3" }, { question: "10/15", answer: "2/3" }, { question: "6/10", answer: "3/5" }
        ],
        medium: [
            { question: "4/10", answer: "2/5" }, { question: "6/16", answer: "3/8" }, { question: "10/12", answer: "5/6" },
            { question: "8/20", answer: "2/5" }, { question: "12/24", answer: "1/2" }, { question: "15/25", answer: "3/5" },
            { question: "14/21", answer: "2/3" }, { question: "16/24", answer: "2/3" }, { question: "9/15", answer: "3/5" },
            { question: "12/18", answer: "2/3" }, { question: "10/25", answer: "2/5" }, { question: "18/27", answer: "2/3" }
        ],
        hard: [
            { question: "4/18", answer: "2/9" }, { question: "10/24", answer: "5/12" }, { question: "14/20", answer: "7/10" },
            { question: "18/32", answer: "9/16" }, { question: "22/40", answer: "11/20" }, { question: "12/30", answer: "2/5" },
            { question: "15/36", answer: "5/12" }, { question: "21/28", answer: "3/4" }, { question: "24/36", answer: "2/3" },
            { question: "27/45", answer: "3/5" }, { question: "30/48", answer: "5/8" }, { question: "33/55", answer: "3/5" }
        ],
        expert: [
            { question: "26/48", answer: "13/24" }, { question: "34/64", answer: "17/32" }, { question: "38/72", answer: "19/36" },
            { question: "46/96", answer: "23/48" }, { question: "58/128", answer: "29/64" }, { question: "39/72", answer: "13/24" },
            { question: "51/96", answer: "17/32" }, { question: "57/108", answer: "19/36" }, { question: "69/144", answer: "23/48" },
            { question: "87/192", answer: "29/64" }, { question: "42/84", answer: "1/2" }, { question: "65/130", answer: "1/2" }
        ]
    },
    addition: {
        easy: [
            { f1: "1/2", f2: "1/2", answer: "1" }, { f1: "1/4", f2: "1/4", answer: "1/2" }, { f1: "1/3", f2: "1/3", answer: "2/3" },
            { f1: "1/8", f2: "3/8", answer: "1/2" }, { f1: "1/5", f2: "2/5", answer: "3/5" }, { f1: "1/6", f2: "2/6", answer: "1/2" },
            { f1: "2/7", f2: "3/7", answer: "5/7" }, { f1: "3/10", f2: "4/10", answer: "7/10" }, { f1: "1/2", f2: "1/4", answer: "3/4" },
            { f1: "1/2", f2: "1/3", answer: "5/6" }, { f1: "1/4", f2: "1/2", answer: "3/4" }, { f1: "2/3", f2: "1/6", answer: "5/6" }
        ],
        medium: [
            { f1: "2/5", f2: "1/5", answer: "3/5" }, { f1: "3/8", f2: "2/8", answer: "5/8" }, { f1: "1/3", f2: "1/6", answer: "1/2" },
            { f1: "2/7", f2: "1/14", answer: "5/14" }, { f1: "3/10", f2: "1/5", answer: "1/2" }, { f1: "1/4", f2: "1/8", answer: "3/8" },
            { f1: "2/9", f2: "1/3", answer: "5/9" }, { f1: "3/7", f2: "2/7", answer: "5/7" }, { f1: "4/15", f2: "2/5", answer: "2/3" },
            { f1: "5/12", f2: "1/6", answer: "7/12" }, { f1: "2/5", f2: "3/10", answer: "7/10" }, { f1: "3/4", f2: "1/8", answer: "7/8" }
        ],
        hard: [
            { f1: "2/9", f2: "1/6", answer: "7/18" }, { f1: "3/8", f2: "1/12", answer: "11/24" }, { f1: "5/12", f2: "1/8", answer: "13/24" },
            { f1: "7/15", f2: "1/10", answer: "17/30" }, { f1: "4/9", f2: "2/7", answer: "46/63" }, { f1: "5/8", f2: "3/10", answer: "37/40" },
            { f1: "7/12", f2: "5/18", answer: "31/36" }, { f1: "8/15", f2: "3/20", answer: "41/60" }, { f1: "9/16", f2: "5/24", answer: "37/48" },
            { f1: "11/20", f2: "3/10", answer: "17/20" }, { f1: "13/24", f2: "5/12", answer: "23/24" }, { f1: "17/32", f2: "3/16", answer: "23/32" }
        ],
        expert: [
            { f1: "13/24", f2: "5/12", answer: "23/24" }, { f1: "17/32", f2: "3/16", answer: "23/32" }, { f1: "19/36", f2: "7/18", answer: "11/12" },
            { f1: "23/48", f2: "5/16", answer: "19/24" }, { f1: "29/64", f2: "11/32", answer: "51/64" }, { f1: "15/28", f2: "3/14", answer: "3/4" },
            { f1: "21/40", f2: "2/5", answer: "37/40" }, { f1: "25/48", f2: "7/24", answer: "13/16" }, { f1: "27/50", f2: "3/10", answer: "21/25" },
            { f1: "31/64", f2: "9/32", answer: "49/64" }, { f1: "33/64", f2: "15/32", answer: "63/64" }, { f1: "35/72", f2: "13/36", answer: "61/72" }
        ]
    },
    subtraction: {
        easy: [
            { f1: "3/4", f2: "1/4", answer: "1/2" }, { f1: "5/6", f2: "1/6", answer: "2/3" }, { f1: "7/8", f2: "3/8", answer: "1/2" },
            { f1: "4/5", f2: "1/5", answer: "3/5" }, { f1: "2/3", f2: "1/3", answer: "1/3" }, { f1: "3/4", f2: "1/2", answer: "1/4" },
            { f1: "5/6", f2: "1/2", answer: "1/3" }, { f1: "7/8", f2: "1/4", answer: "5/8" }, { f1: "4/5", f2: "1/10", answer: "7/10" },
            { f1: "2/3", f2: "1/4", answer: "5/12" }, { f1: "3/5", f2: "1/2", answer: "1/10" }, { f1: "5/8", f2: "1/4", answer: "3/8" }
        ],
        medium: [
            { f1: "7/10", f2: "1/5", answer: "1/2" }, { f1: "5/6", f2: "1/3", answer: "1/2" }, { f1: "4/7", f2: "1/14", answer: "1/2" },
            { f1: "8/9", f2: "1/3", answer: "5/9" }, { f1: "3/4", f2: "1/6", answer: "7/12" }, { f1: "5/8", f2: "1/3", answer: "7/24" },
            { f1: "7/12", f2: "1/4", answer: "1/3" }, { f1: "9/10", f2: "2/5", answer: "1/2" }, { f1: "11/12", f2: "1/6", answer: "3/4" },
            { f1: "13/15", f2: "1/3", answer: "8/15" }, { f1: "5/7", f2: "1/2", answer: "3/14" }, { f1: "4/5", f2: "1/3", answer: "7/15" }
        ],
        hard: [
            { f1: "7/9", f2: "1/6", answer: "11/18" }, { f1: "5/8", f2: "1/5", answer: "17/40" }, { f1: "8/11", f2: "1/4", answer: "21/44" },
            { f1: "9/13", f2: "1/3", answer: "14/39" }, { f1: "7/10", f2: "2/7", answer: "29/70" }, { f1: "5/6", f2: "3/8", answer: "11/24" },
            { f1: "8/9", f2: "3/5", answer: "13/45" }, { f1: "11/14", f2: "3/7", answer: "5/14" }, { f1: "13/16", f2: "1/4", answer: "9/16" },
            { f1: "15/22", f2: "2/11", answer: "1/2" }, { f1: "17/20", f2: "2/5", answer: "9/20" }, { f1: "19/24", f2: "3/8", answer: "5/12" }
        ],
        expert: [
            { f1: "13/16", f2: "5/8", answer: "3/16" }, { f1: "17/24", f2: "5/12", answer: "7/24" }, { f1: "19/32", f2: "7/16", answer: "5/32" },
            { f1: "23/36", f2: "5/12", answer: "2/9" }, { f1: "29/40", f2: "3/8", answer: "7/20" }, { f1: "31/48", f2: "5/12", answer: "11/48" },
            { f1: "33/50", f2: "3/10", answer: "9/25" }, { f1: "37/64", f2: "9/16", answer: "1/64" }, { f1: "41/64", f2: "5/8", answer: "1/64" },
            { f1: "43/72", f2: "5/12", answer: "13/72" }, { f1: "47/80", f2: "3/10", answer: "23/80" }, { f1: "53/96", f2: "11/24", answer: "3/32" }
        ]
    },
    equivalent: {
        easy: [
            { target: "1/2", options: ["2/4","3/6","4/8","5/10"], answer: "2/4" },
            { target: "1/3", options: ["2/6","3/9","4/12","5/15"], answer: "2/6" },
            { target: "2/3", options: ["4/6","6/9","8/12","10/15"], answer: "4/6" },
            { target: "1/4", options: ["2/8","3/12","4/16","5/20"], answer: "2/8" },
            { target: "3/4", options: ["6/8","9/12","12/16","15/20"], answer: "6/8" },
            { target: "2/5", options: ["4/10","6/15","8/20","10/25"], answer: "4/10" },
            { target: "3/5", options: ["6/10","9/15","12/20","15/25"], answer: "6/10" },
            { target: "4/5", options: ["8/10","12/15","16/20","20/25"], answer: "8/10" },
            { target: "1/6", options: ["2/12","3/18","4/24","5/30"], answer: "2/12" },
            { target: "5/6", options: ["10/12","15/18","20/24","25/30"], answer: "10/12" },
            { target: "2/7", options: ["4/14","6/21","8/28","10/35"], answer: "4/14" },
            { target: "3/8", options: ["6/16","9/24","12/32","15/40"], answer: "6/16" }
        ],
        medium: [
            { target: "2/5", options: ["4/10","6/15","8/20","10/25"], answer: "4/10" },
            { target: "3/8", options: ["6/16","9/24","12/32","15/40"], answer: "6/16" },
            { target: "5/6", options: ["10/12","15/18","20/24","25/30"], answer: "10/12" },
            { target: "4/7", options: ["8/14","12/21","16/28","20/35"], answer: "8/14" },
            { target: "7/8", options: ["14/16","21/24","28/32","35/40"], answer: "14/16" },
            { target: "3/10", options: ["6/20","9/30","12/40","15/50"], answer: "6/20" },
            { target: "5/9", options: ["10/18","15/27","20/36","25/45"], answer: "10/18" },
            { target: "4/11", options: ["8/22","12/33","16/44","20/55"], answer: "8/22" },
            { target: "7/12", options: ["14/24","21/36","28/48","35/60"], answer: "14/24" },
            { target: "5/8", options: ["10/16","15/24","20/32","25/40"], answer: "10/16" },
            { target: "3/7", options: ["6/14","9/21","12/28","15/35"], answer: "6/14" },
            { target: "8/9", options: ["16/18","24/27","32/36","40/45"], answer: "16/18" }
        ],
        hard: [
            { target: "2/9", options: ["4/18","6/27","8/36","10/45"], answer: "4/18" },
            { target: "5/12", options: ["10/24","15/36","20/48","25/60"], answer: "10/24" },
            { target: "7/10", options: ["14/20","21/30","28/40","35/50"], answer: "14/20" },
            { target: "9/16", options: ["18/32","27/48","36/64","45/80"], answer: "18/32" },
            { target: "11/20", options: ["22/40","33/60","44/80","55/100"], answer: "22/40" },
            { target: "4/9", options: ["8/18","12/27","16/36","20/45"], answer: "8/18" },
            { target: "7/15", options: ["14/30","21/45","28/60","35/75"], answer: "14/30" },
            { target: "8/13", options: ["16/26","24/39","32/52","40/65"], answer: "16/26" },
            { target: "9/14", options: ["18/28","27/42","36/56","45/70"], answer: "18/28" },
            { target: "10/17", options: ["20/34","30/51","40/68","50/85"], answer: "20/34" },
            { target: "11/18", options: ["22/36","33/54","44/72","55/90"], answer: "22/36" },
            { target: "12/19", options: ["24/38","36/57","48/76","60/95"], answer: "24/38" }
        ],
        expert: [
            { target: "13/24", options: ["26/48","39/72","52/96","65/120"], answer: "26/48" },
            { target: "17/32", options: ["34/64","51/96","68/128","85/160"], answer: "34/64" },
            { target: "19/36", options: ["38/72","57/108","76/144","95/180"], answer: "38/72" },
            { target: "23/48", options: ["46/96","69/144","92/192","115/240"], answer: "46/96" },
            { target: "29/64", options: ["58/128","87/192","116/256","145/320"], answer: "58/128" },
            { target: "15/28", options: ["30/56","45/84","60/112","75/140"], answer: "30/56" },
            { target: "21/40", options: ["42/80","63/120","84/160","105/200"], answer: "42/80" },
            { target: "25/48", options: ["50/96","75/144","100/192","125/240"], answer: "50/96" },
            { target: "27/50", options: ["54/100","81/150","108/200","135/250"], answer: "54/100" },
            { target: "31/64", options: ["62/128","93/192","124/256","155/320"], answer: "62/128" },
            { target: "33/64", options: ["66/128","99/192","132/256","165/320"], answer: "66/128" },
            { target: "35/72", options: ["70/144","105/216","140/288","175/360"], answer: "70/144" }
        ]
    },
    reallife: {
        easy: [
            { story: "🍕 Pizza has 8 slices. You eat 4 slices. What fraction did you eat?", answer: "1/2" },
            { story: "🍎 Basket has 6 apples. 3 are red. What fraction are red?", answer: "1/2" },
            { story: "🎂 Cake cut into 4 pieces. 1 piece eaten. What fraction remains?", answer: "3/4" },
            { story: "📚 Book has 10 chapters. You read 5. What fraction read?", answer: "1/2" },
            { story: "🎈 12 balloons. 3 are blue. What fraction blue?", answer: "1/4" },
            { story: "🍬 Candy jar has 20 candies. 5 are red. What fraction red?", answer: "1/4" },
            { story: "🐶 8 puppies. 2 are brown. What fraction brown?", answer: "1/4" },
            { story: "🍕 12 pizza slices. 8 are cheese. What fraction cheese?", answer: "2/3" },
            { story: "🎨 15 crayons. 5 are blue. What fraction blue?", answer: "1/3" },
            { story: "🏀 10 basketballs. 4 are new. What fraction new?", answer: "2/5" },
            { story: "📖 20 pages. You read 15. What fraction read?", answer: "3/4" },
            { story: "🍪 18 cookies. 6 are chocolate. What fraction chocolate?", answer: "1/3" }
        ],
        medium: [
            { story: "🏃 30 students. 12 are boys. What fraction boys?", answer: "2/5" },
            { story: "🎨 24 crayons. 9 are red. What fraction red?", answer: "3/8" },
            { story: "🍕 16 pizza slices. 10 are pepperoni. What fraction?", answer: "5/8" },
            { story: "📚 40 books. 15 are non-fiction. What fraction?", answer: "3/8" },
            { story: "🎈 25 balloons. 10 are red. What fraction red?", answer: "2/5" },
            { story: "🍎 18 apples. 12 are green. What fraction green?", answer: "2/3" },
            { story: "🎂 12 cake pieces. 7 are eaten. What fraction eaten?", answer: "7/12" },
            { story: "🐱 28 cats. 16 are black. What fraction black?", answer: "4/7" },
            { story: "🚗 35 cars. 20 are white. What fraction white?", answer: "4/7" },
            { story: "🏀 24 basketballs. 15 are used. What fraction used?", answer: "5/8" },
            { story: "📖 32 pages. 20 are read. What fraction read?", answer: "5/8" },
            { story: "🍪 36 cookies. 21 are chocolate. What fraction?", answer: "7/12" }
        ],
        hard: [
            { story: "🎯 Target hit 18 out of 30 times. What fraction?", answer: "3/5" },
            { story: "🏃 45 runners. 18 finished. What fraction finished?", answer: "2/5" },
            { story: "🍕 24 pizza slices. 16 are eaten. What fraction left?", answer: "1/3" },
            { story: "📚 36 books. 20 are fiction. What fraction fiction?", answer: "5/9" },
            { story: "🎨 42 crayons. 24 are broken. What fraction broken?", answer: "4/7" },
            { story: "🌳 54 trees. 30 are fruit trees. What fraction?", answer: "5/9" },
            { story: "🐟 48 fish. 32 are goldfish. What fraction?", answer: "2/3" },
            { story: "🚗 60 cars. 25 are electric. What fraction?", answer: "5/12" },
            { story: "📱 72 phones. 42 are smartphones. What fraction?", answer: "7/12" },
            { story: "🍪 84 cookies. 49 are chocolate. What fraction?", answer: "7/12" },
            { story: "🎈 90 balloons. 50 are blue. What fraction blue?", answer: "5/9" },
            { story: "🏀 100 basketballs. 65 are new. What fraction new?", answer: "13/20" }
        ],
        expert: [
            { story: "🎯 Target hit 85 out of 160 times. What fraction?", answer: "17/32" },
            { story: "🏃 120 runners. 65 finished. What fraction finished?", answer: "13/24" },
            { story: "🍕 96 pizza slices. 52 are eaten. What fraction eaten?", answer: "13/24" },
            { story: "📚 200 books. 115 are fiction. What fraction?", answer: "23/40" },
            { story: "🎨 144 crayons. 76 are broken. What fraction?", answer: "19/36" },
            { story: "🌳 192 trees. 116 are fruit trees. What fraction?", answer: "29/48" },
            { story: "🐟 256 fish. 128 are goldfish. What fraction?", answer: "1/2" },
            { story: "🚗 300 cars. 120 are electric. What fraction?", answer: "2/5" },
            { story: "📱 360 phones. 195 are smartphones. What fraction?", answer: "13/24" },
            { story: "🍪 400 cookies. 225 are chocolate. What fraction?", answer: "9/16" },
            { story: "🎈 500 balloons. 275 are blue. What fraction?", answer: "11/20" },
            { story: "🏀 640 basketballs. 340 are new. What fraction?", answer: "17/32" }
        ]
    }
};

// ============================================
// API FUNCTIONS - CLOUDFLARE WORKERS
// ============================================

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const url = `${CONFIG.API_BASE}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'magicrills-grok-api.uzairhameed01.workers.dev'
            }
        };
        if (data) options.body = JSON.stringify(data);
        
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.warn('API Error:', error);
        return { success: false, error: error.message };
    }
}

// ✅ Record Usage
async function recordUsage() {
    try {
        const result = await apiCall('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            user_id: userId
        });
        if (result.success) {
            document.getElementById('usageCount').textContent = result.total_usage || '0';
            document.getElementById('uniqueUsers').textContent = result.unique_users || '0';
        }
    } catch (error) {
        // Fallback: LocalStorage
        let localCount = parseInt(localStorage.getItem('localUsage') || '0') + 1;
        localStorage.setItem('localUsage', localCount);
        document.getElementById('usageCount').textContent = localCount;
    }
}

// ✅ Load Stats
async function loadStats() {
    try {
        const result = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result.success) {
            document.getElementById('usageCount').textContent = result.total_usage || '0';
            document.getElementById('uniqueUsers').textContent = result.unique_users || '0';
            document.getElementById('shareCount').textContent = result.total_shares || '0';
            document.getElementById('followersCount').textContent = result.followers || '0';
        }
    } catch (error) {
        // Fallback: LocalStorage
        document.getElementById('usageCount').textContent = localStorage.getItem('localUsage') || '0';
    }
}

// ✅ Load Reactions
async function loadReactions() {
    try {
        const result = await apiCall(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result.success && result.reactions) {
            const emojiMap = {
                'like': 'react-like',
                'love': 'react-love',
                'wow': 'react-wow',
                'sad': 'react-sad',
                'laugh': 'react-laugh',
                'celebrate': 'react-celebrate'
            };
            Object.keys(emojiMap).forEach(key => {
                const el = document.getElementById(emojiMap[key]);
                if (el) el.textContent = result.reactions[key] || 0;
            });
        }
    } catch (error) {
        console.warn('Failed to load reactions:', error);
    }
}

// ✅ Add Reaction
async function addReaction(emoji) {
    const emojiMap = {
        '👍': 'like', '❤️': 'love', '😮': 'wow',
        '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate'
    };
    try {
        const result = await apiCall('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            emoji: emoji,
            reaction_type: emojiMap[emoji] || 'like',
            user_id: userId
        });
        if (result.success) {
            loadReactions();
            showToast(`Thanks for ${emoji}!`);
        }
    } catch (error) {
        showToast(`Thanks for ${emoji}! (offline)`, false);
    }
}

// ✅ Record Share
async function recordShare(platform) {
    try {
        const result = await apiCall('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform,
            user_id: userId
        });
        if (result.success) {
            showToast(`Shared on ${platform}!`);
            loadStats();
        }
    } catch (error) {
        showToast(`Shared on ${platform}! (offline)`, false);
    }
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast' + (isError ? ' error' : '');
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function updateUI() {
    document.getElementById('score').textContent = state.score;
    document.getElementById('streak').textContent = state.streak;
    document.getElementById('questionCounter').textContent = state.questionIndex;
    const progress = ((state.questionIndex - 1) / state.totalQuestions) * 100;
    document.getElementById('progressBar').style.width = Math.max(0, progress) + '%';
}

function playSound(type) {
    if (!state.soundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === 'correct') {
            osc.frequency.value = 880;
            gain.gain.value = 0.15;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
            osc.stop(ctx.currentTime + 0.2);
        } else if (type === 'wrong') {
            osc.frequency.value = 220;
            gain.gain.value = 0.15;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
            osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'flip') {
            osc.frequency.value = 600;
            gain.gain.value = 0.05;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.05);
            osc.stop(ctx.currentTime + 0.05);
        }
    } catch(e) { /* Silent fail */ }
}

function showFeedback(isCorrect, correctAnswer = null) {
    const gameArea = document.getElementById('gameArea');
    let feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback';
    
    if (isCorrect) {
        feedbackDiv.innerHTML = '🎉 Correct! Well done! 🎉';
        feedbackDiv.classList.add('correct');
        playSound('correct');
        state.streak++;
        if (state.streak > state.bestStreak) state.bestStreak = state.streak;
        state.score += 10 + (state.streak >= 3 ? state.streak * 5 : 0);
        state.questionIndex++;
        updateUI();
        updateChecklist();
    } else {
        feedbackDiv.innerHTML = `❌ Oops! Correct: ${correctAnswer || 'Try again!'}. Keep practicing! ❌`;
        feedbackDiv.classList.add('incorrect');
        playSound('wrong');
        state.streak = 0;
        updateUI();
        state.questionIndex++;
    }
    
    gameArea.appendChild(feedbackDiv);
    setTimeout(() => {
        feedbackDiv.remove();
        if (state.questionIndex <= state.totalQuestions) {
            loadCurrentQuestion();
        } else {
            endGame();
        }
    }, 2000);
}

function endGame() {
    state.gameActive = false;
    clearInterval(state._timerInterval);
    document.getElementById('finalScore').textContent = state.score;
    document.getElementById('finalQuestions').textContent = state.questionIndex - 1;
    document.getElementById('finalStreak').textContent = state.bestStreak;
    document.getElementById('gameOver').classList.add('show');
    updateChecklist();
}

function startTimer() {
    clearInterval(state._timerInterval);
    state._timerInterval = setInterval(() => {
        if (state.gameActive) {
            state.timeElapsed++;
            document.getElementById('timer').textContent = state.timeElapsed;
        }
    }, 1000);
}

// ============================================
// ✅ HELPER: Render Fraction as HTML
// ============================================

function renderFraction(fracString) {
    if (!fracString) return '';
    // Check if it's a whole number like "1"
    if (!fracString.includes('/')) {
        return `<span class="fraction-display"><span class="numerator" style="border-bottom: none;">${fracString}</span></span>`;
    }
    const parts = fracString.split('/');
    if (parts.length !== 2) return fracString;
    const num = parts[0].trim();
    const den = parts[1].trim();
    return `<span class="fraction-display"><span class="numerator">${num}</span><span class="denominator">${den}</span></span>`;
}

// ============================================
// GAME LOADERS
// ============================================

function loadCurrentQuestion() {
    const mode = state.mode;
    if (mode === 'matching') { loadMatchingGame(); return; }
    if (mode === 'compare') { loadCompareQuestion(); return; }
    if (mode === 'simplify') { loadSimplifyQuestion(); return; }
    if (mode === 'addition') { loadOperationQuestion('addition'); return; }
    if (mode === 'subtraction') { loadOperationQuestion('subtraction'); return; }
    if (mode === 'equivalent') { loadEquivalentQuestion(); return; }
    if (mode === 'numberline') { loadNumberLineQuestion(); return; }
    if (mode === 'reallife') { loadRealLifeQuestion(); return; }
    if (mode === 'dice') { loadDiceGame(); return; }
    if (mode === 'timechallenge') { loadTimeChallenge(); return; }
}

function getQuestionBank(mode) {
    return QUESTION_BANK[mode]?.[state.level] || [];
}

function getCurrentQuestion(mode) {
    const bank = getQuestionBank(mode);
    return bank[(state.questionIndex - 1) % bank.length];
}

// ✅ Compare - Professional UI with proper fraction rendering
function loadCompareQuestion() {
    const q = getCurrentQuestion('compare');
    state.currentAnswer = q.answer;
    
    const leftHTML = renderFraction(q.left);
    const rightHTML = renderFraction(q.right);
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="compare-container">
            <h2>⚖️ Compare Fractions</h2>
            <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 0.95rem;">
                Question ${state.questionIndex} of ${state.totalQuestions}
            </p>
            
            <div class="compare-fractions-wrapper">
                <div class="compare-fraction-box">
                    <div style="font-size: 2.8rem; font-weight: 700;">${leftHTML}</div>
                    <span class="fraction-label">Fraction 1</span>
                </div>
                
                <div class="compare-vs">?</div>
                
                <div class="compare-fraction-box">
                    <div style="font-size: 2.8rem; font-weight: 700;">${rightHTML}</div>
                    <span class="fraction-label">Fraction 2</span>
                </div>
            </div>
            
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 16px;">
                Which symbol makes the statement true?
            </p>
            
            <div class="compare-options">
                <button class="compare-btn" data-compare=">">
                    &gt;
                    <span class="compare-label">Greater</span>
                </button>
                <button class="compare-btn" data-compare="<">
                    &lt;
                    <span class="compare-label">Less</span>
                </button>
                <button class="compare-btn" data-compare="=">
                    =
                    <span class="compare-label">Equal</span>
                </button>
            </div>
            
            <div style="margin-top: 12px; font-size: 0.8rem; color: var(--text-muted);">
                💡 Tip: ${q.left} is ${q.answer === '>' ? 'greater than' : q.answer === '<' ? 'less than' : 'equal to'} ${q.right}
            </div>
        </div>
    `;
    
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selected = e.currentTarget.dataset.compare;
            showFeedback(selected === state.currentAnswer, state.currentAnswer);
        });
    });
}

// ✅ Simplify
function loadSimplifyQuestion() {
    const q = getCurrentQuestion('simplify');
    state.currentAnswer = q.answer;
    const questionHTML = renderFraction(q.question);
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="simplify-container">
            <h2>🔄 Simplify (Q${state.questionIndex}/${state.totalQuestions})</h2>
            <div class="simplify-question">${questionHTML}</div>
            <div class="answer-section">
                <input type="text" id="simplifyAnswer" class="answer-input" placeholder="Enter simplified fraction">
                <button class="btn-submit" id="submitAnswer">Submit</button>
            </div>
        </div>
    `;
    document.getElementById('submitAnswer').addEventListener('click', () => {
        const userAnswer = document.getElementById('simplifyAnswer').value.trim();
        showFeedback(userAnswer === state.currentAnswer, state.currentAnswer);
    });
}

// ✅ Operations
function loadOperationQuestion(operation) {
    const q = getCurrentQuestion(operation);
    state.currentAnswer = q.answer;
    const opSymbol = operation === 'addition' ? '+' : '-';
    const f1HTML = renderFraction(q.f1);
    const f2HTML = renderFraction(q.f2);
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="operation-container">
            <h2>${operation === 'addition' ? '➕ Addition' : '➖ Subtraction'} (Q${state.questionIndex}/${state.totalQuestions})</h2>
            <div class="operation-question">${f1HTML} ${opSymbol} ${f2HTML} = ?</div>
            <div class="answer-section">
                <input type="text" id="operationAnswer" class="answer-input" placeholder="Your answer">
                <button class="btn-submit" id="submitAnswer">Submit</button>
            </div>
        </div>
    `;
    document.getElementById('submitAnswer').addEventListener('click', () => {
        const userAnswer = document.getElementById('operationAnswer').value.trim();
        showFeedback(userAnswer === state.currentAnswer, state.currentAnswer);
    });
}

// ✅ Equivalent
function loadEquivalentQuestion() {
    const q = getCurrentQuestion('equivalent');
    state.currentAnswer = q.answer;
    let options = [...q.options];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    const targetHTML = renderFraction(q.target);
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="equivalent-container">
            <h2>🔄 Equivalent Fractions (Q${state.questionIndex}/${state.totalQuestions})</h2>
            <div class="equivalent-question">Which is equivalent to <strong style="font-size:2rem;">${targetHTML}</strong>?</div>
            <div class="equivalent-grid" id="equivGrid"></div>
        </div>
    `;
    const grid = document.getElementById('equivGrid');
    options.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'equivalent-card';
        card.innerHTML = renderFraction(opt);
        card.addEventListener('click', () => showFeedback(opt === state.currentAnswer, state.currentAnswer));
        grid.appendChild(card);
    });
}

// ✅ Number Line
function loadNumberLineQuestion() {
    const levelData = {
        easy: ["1/2", "1/3", "1/4", "2/3", "3/4"],
        medium: ["2/5", "3/8", "5/6", "4/7"],
        hard: ["2/9", "5/12", "7/10", "9/16", "11/20"],
        expert: ["13/24", "17/32", "19/36", "23/48", "29/64"]
    };
    const fractions = levelData[state.level] || levelData.easy;
    const targetFraction = fractions[(state.questionIndex - 1) % fractions.length];
    const [num, den] = targetFraction.split('/').map(Number);
    const value = num / den;
    state.currentAnswer = targetFraction;
    const targetHTML = renderFraction(targetFraction);
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="numberline-container">
            <h2>📊 Place on Number Line (Q${state.questionIndex}/${state.totalQuestions})</h2>
            <p>Click where <strong style="font-size:1.5rem;">${targetHTML}</strong> belongs!</p>
            <div class="number-line" id="numberLine">
                <div class="number-markers">
                    <span class="marker">0</span>
                    <span class="marker">1/4</span>
                    <span class="marker">1/2</span>
                    <span class="marker">3/4</span>
                    <span class="marker">1</span>
                </div>
            </div>
        </div>
    `;
    const numberLine = document.getElementById('numberLine');
    numberLine.addEventListener('click', (e) => {
        const rect = numberLine.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const tolerance = 0.08;
        if (Math.abs(percentage - value) <= tolerance) {
            showFeedback(true, state.currentAnswer);
        } else {
            showFeedback(false, `${targetFraction} (at ${(value*100).toFixed(0)}%)`);
        }
    });
}

// ✅ Real Life
function loadRealLifeQuestion() {
    const q = getCurrentQuestion('reallife');
    state.currentAnswer = q.answer;
    const answerHTML = renderFraction(q.answer);
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="reallife-container">
            <h2>🍕 Real Life (Q${state.questionIndex}/${state.totalQuestions})</h2>
            <div class="story-card">${q.story}</div>
            <div class="answer-section">
                <input type="text" id="reallifeAnswer" class="answer-input" placeholder="Enter fraction (e.g., 1/2)">
                <button class="btn-submit" id="submitAnswer">Submit</button>
            </div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: var(--text-muted);">
                💡 Hint: The answer is ${answerHTML}
            </div>
        </div>
    `;
    document.getElementById('submitAnswer').addEventListener('click', () => {
        const userAnswer = document.getElementById('reallifeAnswer').value.trim();
        showFeedback(userAnswer === state.currentAnswer, state.currentAnswer);
    });
}

// ✅ Matching Game
let matchingCards = [], matchedPairs = 0, totalPairs = 12;
let firstCard = null, secondCard = null, lockBoard = false, hasFlipped = false;

function loadMatchingGame() {
    const levelFractions = {
        easy: ['1/2', '1/3', '1/4', '2/3', '3/4', '2/5', '3/5', '4/5', '1/6', '5/6', '2/7', '3/7'],
        medium: ['2/5', '3/8', '5/6', '4/7', '7/8', '3/10', '5/9', '4/11', '7/12', '5/8', '3/7', '8/9'],
        hard: ['2/9', '5/12', '7/10', '9/16', '11/20', '4/15', '7/18', '8/21', '10/23', '13/25', '11/24', '14/27'],
        expert: ['13/24', '17/32', '19/36', '23/48', '29/64', '31/64', '33/64', '35/72', '37/80', '41/84', '43/90', '47/96']
    };
    const fractions = levelFractions[state.level] || levelFractions.easy;
    totalPairs = 12;
    matchedPairs = 0;
    
    let cardPairs = [];
    fractions.forEach((fraction, idx) => {
        const [num, den] = fraction.split('/').map(Number);
        const colors = ['#FF6B35', '#4ECDC4', '#FFE66D', '#9B5DE5', '#F15BB5', '#06D6A0'];
        const color = colors[idx % colors.length];
        const svg = `<svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)" stroke="${color}" stroke-width="2"/>
            <path d="M50 50 L50 10 A40 40 0 ${(num/den)*360 > 180 ? 1 : 0} 1 ${50 + 40 * Math.sin((num/den)*360 * Math.PI/180)} ${50 - 40 * Math.cos((num/den)*360 * Math.PI/180)} Z" fill="${color}" opacity="0.6"/>
            <text x="50" y="55" text-anchor="middle" font-size="12" fill="white" font-weight="bold">${num}/${den}</text>
        </svg>`;
        cardPairs.push({ id: idx*2, pairId: idx, content: svg, value: fraction, matched: false, type: 'visual' });
        cardPairs.push({ id: idx*2+1, pairId: idx, content: `<div style="font-size:1.4rem;font-weight:700;color:white;">${fraction}</div>`, value: fraction, matched: false, type: 'text' });
    });
    
    for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }
    matchingCards = cardPairs;
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h2 style="text-align:center;">🎴 Memory Match (${totalPairs} pairs)</h2>
        <div class="game-board" id="gameBoard"></div>
        <p style="text-align:center;margin-top:16px;color:var(--text-muted);">Match each fraction with its visual representation!</p>
    `;
    const board = document.getElementById('gameBoard');
    matchingCards.forEach((card, index) => {
        const el = document.createElement('div');
        el.className = 'card';
        el.dataset.index = index;
        el.dataset.pairId = card.pairId;
        el.innerHTML = `
            <div class="card-front">${card.content}</div>
            <div class="card-back">?</div>
        `;
        el.addEventListener('click', () => flipMatchingCard(el, index));
        board.appendChild(el);
    });
}

function flipMatchingCard(element, index) {
    if (lockBoard || matchingCards[index].matched || element.classList.contains('flipped')) return;
    if (hasFlipped && firstCard && firstCard.dataset.index == index) return;
    playSound('flip');
    element.classList.add('flipped');
    
    if (!hasFlipped) {
        hasFlipped = true;
        firstCard = element;
        firstCard.dataset.index = index;
    } else {
        secondCard = element;
        secondCard.dataset.index = index;
        lockBoard = true;
        checkMatchingMatch();
    }
}

function checkMatchingMatch() {
    const firstIdx = parseInt(firstCard.dataset.index);
    const secondIdx = parseInt(secondCard.dataset.index);
    const isMatch = matchingCards[firstIdx].pairId === matchingCards[secondIdx].pairId;
    
    if (isMatch) {
        matchingCards[firstIdx].matched = true;
        matchingCards[secondIdx].matched = true;
        setTimeout(() => {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedPairs++;
            state.streak++;
            if (state.streak > state.bestStreak) state.bestStreak = state.streak;
            state.score += 10 + (state.streak >= 3 ? state.streak * 5 : 0);
            updateUI();
            resetMatchingBoard();
            if (matchedPairs === totalPairs) {
                state.questionIndex = state.totalQuestions;
                endGame();
            }
        }, 600);
    } else {
        state.streak = 0;
        updateUI();
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetMatchingBoard();
        }, 1000);
    }
}

function resetMatchingBoard() {
    hasFlipped = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

// ✅ Dice Game
let diceNumerator = 1, diceDenominator = 6, diceQuestion = null;

function loadDiceGame() {
    state.currentAnswer = null;
    diceNumerator = 1;
    diceDenominator = 6;
    diceQuestion = null;
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="dice-container">
            <h2>🎲 Fraction Roll (Q${state.questionIndex}/${state.totalQuestions})</h2>
            <p>Roll both dice to create a fraction!</p>
            <div style="display:flex;justify-content:center;gap:40px;flex-wrap:wrap;">
                <div><div class="dice" id="dice1">🎲</div><p>Numerator</p></div>
                <div><div class="dice" id="dice2">🎲</div><p>Denominator</p></div>
            </div>
            <div class="answer-section" style="margin-top:24px;">
                <input type="text" id="diceAnswer" class="answer-input" placeholder="Enter your fraction">
                <button class="btn-submit" id="submitAnswer">Submit</button>
            </div>
            <div id="diceFeedback" style="margin-top:16px;font-size:1.2rem;"></div>
        </div>
    `;
    document.getElementById('dice1').addEventListener('click', () => rollDice('dice1', 'num'));
    document.getElementById('dice2').addEventListener('click', () => rollDice('dice2', 'den'));
    document.getElementById('submitAnswer').addEventListener('click', () => {
        const userAnswer = document.getElementById('diceAnswer').value.trim();
        if (diceQuestion) {
            showFeedback(userAnswer === diceQuestion, diceQuestion);
            diceQuestion = null;
            document.getElementById('diceFeedback').innerHTML = '';
        } else {
            showToast('Roll both dice first!', true);
        }
    });
}

function rollDice(elementId, type) {
    const diceEl = document.getElementById(elementId);
    diceEl.classList.add('rolling');
    const value = Math.floor(Math.random() * 6) + 1;
    setTimeout(() => {
        diceEl.classList.remove('rolling');
        diceEl.textContent = getDiceFace(value);
        if (type === 'num') diceNumerator = value;
        else diceDenominator = value;
        if (diceNumerator && diceDenominator && diceDenominator !== 0) {
            diceQuestion = `${diceNumerator}/${diceDenominator}`;
            document.getElementById('diceFeedback').innerHTML = `Your fraction: <strong style="font-size:1.5rem;">${renderFraction(diceQuestion)}</strong>`;
        }
    }, 500);
}

function getDiceFace(value) {
    const faces = {1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅'};
    return faces[value] || '🎲';
}

// ✅ Time Challenge
let challengeActive = false, challengeScore = 0, challengeTimeLeft = 60;
let challengeQuestions = [], challengeIndex = 0;

function loadTimeChallenge() {
    challengeActive = true;
    challengeScore = 0;
    challengeTimeLeft = 60;
    challengeIndex = 0;
    state.questionIndex = 1;
    
    const bank = QUESTION_BANK.addition[state.level] || QUESTION_BANK.addition.easy;
    challengeQuestions = [...bank];
    for (let i = challengeQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [challengeQuestions[i], challengeQuestions[j]] = [challengeQuestions[j], challengeQuestions[i]];
    }
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="timechallenge-container">
            <h2>⏰ Time Challenge - 60 Seconds!</h2>
            <div class="challenge-timer" id="challengeTimer">01:00</div>
            <div class="challenge-question" id="challengeQuestion">Get ready...</div>
            <div class="answer-section">
                <input type="text" id="challengeAnswer" class="answer-input" placeholder="Your answer">
                <button class="btn-submit" id="submitChallenge">Submit</button>
            </div>
            <div style="margin-top:16px;">Score: <strong id="challengeScoreDisplay">0</strong> | Q: <span id="challengeQCounter">0</span>/12</div>
        </div>
    `;
    startTimeChallenge();
    document.getElementById('submitChallenge').addEventListener('click', handleChallengeAnswer);
}

function startTimeChallenge() {
    const timerEl = document.getElementById('challengeTimer');
    const challengeInterval = setInterval(() => {
        if (!challengeActive) { clearInterval(challengeInterval); return; }
        challengeTimeLeft--;
        const mins = Math.floor(challengeTimeLeft / 60);
        const secs = challengeTimeLeft % 60;
        timerEl.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
        if (challengeTimeLeft <= 0) {
            clearInterval(challengeInterval);
            challengeActive = false;
            state.score = challengeScore;
            endGame();
        }
    }, 1000);
    showChallengeQuestion();
}

function showChallengeQuestion() {
    if (challengeIndex < challengeQuestions.length) {
        const q = challengeQuestions[challengeIndex];
        state.currentAnswer = q.answer;
        const f1HTML = renderFraction(q.f1);
        const f2HTML = renderFraction(q.f2);
        document.getElementById('challengeQuestion').innerHTML = `${f1HTML} + ${f2HTML} = ?`;
        document.getElementById('challengeQCounter').textContent = challengeIndex + 1;
    }
}

function handleChallengeAnswer() {
    if (!challengeActive) return;
    const userAnswer = document.getElementById('challengeAnswer').value.trim();
    const q = challengeQuestions[challengeIndex];
    if (userAnswer === q.answer) {
        challengeScore += 10;
        document.getElementById('challengeScoreDisplay').textContent = challengeScore;
        playSound('correct');
    } else {
        playSound('wrong');
        showToast(`Wrong! Answer: ${q.answer}`, true);
    }
    challengeIndex++;
    document.getElementById('challengeAnswer').value = '';
    if (challengeIndex < challengeQuestions.length) {
        showChallengeQuestion();
    } else {
        challengeActive = false;
        state.score = challengeScore;
        endGame();
    }
}

// ============================================
// CHECKLIST
// ============================================

function updateChecklist() {
    const items = document.querySelectorAll('.checklist-item');
    const completed = Math.min(Math.floor(state.score / 20), items.length);
    items.forEach((item, index) => {
        if (index < completed) {
            item.dataset.checked = 'true';
            item.classList.add('checked');
            item.querySelector('.checklist-status').textContent = '✅';
        }
    });
}

// ============================================
// AI INTEGRATION (Simulated)
// ============================================

const AI_RESPONSES = {
    'what is': 'A fraction represents a part of a whole. It consists of a numerator (top number) and a denominator (bottom number).',
    'how to add': 'To add fractions, find a common denominator, add the numerators, and simplify if needed.',
    'how to subtract': 'To subtract fractions, find a common denominator, subtract the numerators, and simplify if needed.',
    'how to multiply': 'To multiply fractions, multiply the numerators together and the denominators together, then simplify.',
    'how to divide': 'To divide fractions, flip the second fraction (reciprocal) and multiply.',
    'equivalent': 'Equivalent fractions are different fractions that represent the same value. Example: 1/2 = 2/4 = 3/6.',
    'simplify': 'To simplify a fraction, divide both numerator and denominator by their greatest common factor (GCF).',
    'compare': 'To compare fractions, find a common denominator or convert to decimals, then compare.',
    'mixed number': 'A mixed number is a whole number and a fraction combined, like 1 1/2.',
    'improper fraction': 'An improper fraction has a numerator larger than or equal to the denominator, like 5/3.'
};

function getAIResponse(query) {
    const lower = query.toLowerCase();
    for (const [key, response] of Object.entries(AI_RESPONSES)) {
        if (lower.includes(key)) return response;
    }
    return "I'm here to help with fractions! Try asking about: addition, subtraction, multiplication, division, simplification, equivalent fractions, or comparisons.";
}

function setupAI() {
    const input = document.getElementById('aiInput');
    const sendBtn = document.getElementById('aiSendBtn');
    const messages = document.getElementById('aiMessages');
    
    function sendMessage() {
        const query = input.value.trim();
        if (!query) return;
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message user';
        userMsg.textContent = query;
        messages.appendChild(userMsg);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        
        setTimeout(() => {
            const response = getAIResponse(query);
            const botMsg = document.createElement('div');
            botMsg.className = 'ai-message bot';
            botMsg.textContent = response;
            messages.appendChild(botMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 500);
    }
    
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
}

// ============================================
// TYPEWRITER EFFECT
// ============================================

function setupTypewriter() {
    const phrases = [
        'Learn Fractions Through Play! 🎮',
        '10 Interactive Games! 🎯',
        'Master Fractions Today! 📚',
        '4 Difficulty Levels! ⚡',
        '480+ Unique Questions! 🧠',
        'Made for Everyone! 🌟'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriterText');
    
    function type() {
        const current = phrases[phraseIndex];
        if (!isDeleting) {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 80);
        } else {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 40);
        }
    }
    type();
}

// ============================================
// EVENT LISTENERS
// ============================================

function init() {
    // Dark Mode
    const darkBtn = document.getElementById('darkModeBtn');
    darkBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkBtn.textContent = '☀️';
    }
    
    // Sound
    const soundBtn = document.getElementById('soundBtn');
    soundBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        soundBtn.textContent = state.soundEnabled ? '🔊' : '🔇';
        localStorage.setItem('soundEnabled', state.soundEnabled);
    });
    if (localStorage.getItem('soundEnabled') === 'false') {
        state.soundEnabled = false;
        soundBtn.textContent = '🔇';
    }
    
    // Mode Selector
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.mode = btn.dataset.mode;
            startGame();
        });
    });
    
    // Level Selector
    document.querySelectorAll('.level-badge').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.level-badge').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.level = btn.dataset.level;
            startGame();
        });
    });
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(react => {
        react.addEventListener('click', () => addReaction(react.dataset.emoji));
    });
    
    // Shares
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => recordShare(btn.dataset.platform));
    });
    
    // Scroll
    document.getElementById('scrollUp').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('scrollDown').addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    // Play Again
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        document.getElementById('gameOver').classList.remove('show');
        startGame();
    });
    
    // Info
    document.getElementById('infoBtn').addEventListener('click', () => {
        showToast('🎮 10 Games! 4 Levels! 12 Unique Questions Each! 480+ Total!');
    });
    
    // Start Game Button
    document.getElementById('startGameBtn').addEventListener('click', () => {
        document.querySelector('.mode-btn.active')?.click() || startGame();
    });
    
    // Explore Button
    document.getElementById('exploreBtn').addEventListener('click', () => {
        document.querySelector('.game-mode-selector').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Setup AI
    setupAI();
    
    // Typewriter
    setupTypewriter();
    
    // Load data and start
    loadStats();
    loadReactions();
    recordUsage();
    startGame();
}

function startGame() {
    state.gameActive = true;
    state.score = 0;
    state.questionIndex = 1;
    state.streak = 0;
    state.bestStreak = 0;
    state.timeElapsed = 0;
    matchedPairs = 0;
    hasFlipped = false;
    lockBoard = false;
    challengeActive = false;
    
    document.getElementById('gameOver').classList.remove('show');
    startTimer();
    updateUI();
    loadCurrentQuestion();
}

// ============================================
// START APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', init);
