// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    TOOL_NAME: 'Developmental Milestone Checker',
    TOOL_SLUG: 'developmental-milestone-checker',
    CATEGORY: 'Kids-Games',
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    REACTIONS: ['👍', '❤️', '😮', '😢', '😂', '🎉']
};

// ============================================================
// MILESTONE DATA
// ============================================================
const milestoneData = {
    "2": {
        physical: [
            "Walks alone confidently", "Pulls toys while walking", "Begins to run stiffly",
            "Kicks a ball forward", "Climbs onto furniture without help", "Walks up/down stairs with support",
            "Stands on tiptoes", "Throws ball overhand", "Scribbles spontaneously",
            "Builds tower of 4+ blocks", "Turns pages one at a time", "Drinks from open cup"
        ],
        cognitive: [
            "Finds hidden objects easily", "Sorts by shapes and colors", "Begins make-believe play",
            "Builds towers of 4+ blocks", "Completes sentences in familiar books", "Points to named objects in book",
            "Follows 2-step instructions", "Names items in picture book", "Matches objects to pictures",
            "Understands object permanence", "Imitates adult actions", "Solves simple problems",
            "Remembers where toys are kept", "Shows interest in new experiences"
        ],
        language: [
            "Points to named body parts", "Knows names of familiar people", "Says 2-4 word sentences",
            "Follows simple instructions", "Repeats overheard words", "Names common objects",
            "Uses 50+ words", "Asks for items by name", "Sings simple songs",
            "Uses pronouns (I, me, you)", "Describes events using words", "Answers simple questions",
            "Uses words to express needs", "Engages in short conversations", "Imitates animal sounds"
        ],
        social: [
            "Imitates adults and peers", "Shows growing independence", "Enjoys company of other children",
            "Shows defiant behavior", "Plays simple pretend games", "Shows affection to familiar people",
            "Takes turns with prompting", "Shows excitement with peers", "Expresses range of emotions",
            "Shows empathy when others hurt", "Parallel play alongside others", "Begins to share toys",
            "Recognizes self in mirror/photos", "Shows separation anxiety", "Seeks comfort from caregivers"
        ],
        behavioral: [
            "Follows simple routines", "Helps with simple tasks", "Shows frustration when unable to do tasks",
            "Begins to test limits", "Has temper tantrums", "Shows preference for certain activities",
            "Can wait briefly for needs", "Responds to redirection", "Shows pride in accomplishments",
            "Begins toilet training readiness", "Follows simple rules", "Cleans up with assistance",
            "Shows attachment to objects", "Transitions between activities", "Demonstrates emerging self-control"
        ],
        moral: [
            "Shows early signs of empathy", "Understands 'no' and simple rules", "Distinguishes between allowed/not allowed",
            "Shows guilt after misbehavior", "Comforts others in distress", "Begins to understand sharing",
            "Follows simple commands", "Shows preference for fairness", "Recognizes others' emotions",
            "Begins to understand consequences", "Shows concern for crying peers", "Responds to praise/scolding",
            "Learns from simple corrections", "Shows emerging sense of right/wrong", "Begins to take turns"
        ]
    },
    "3": {
        physical: [
            "Climbs well on playground equipment", "Runs easily without falling", "Pedals a tricycle",
            "Walks up/down stairs alternating feet", "Kicks and throws a small ball", "Hops on one foot briefly",
            "Catches large ball with arms", "Draws circles and lines", "Strings large beads",
            "Turns rotating handles", "Uses scissors with help", "Dresses with assistance",
            "Stacks 6+ blocks", "Jumps with both feet", "Pours from small pitcher"
        ],
        cognitive: [
            "Works toys with buttons/levers", "Plays make-believe with dolls", "Does 3-4 piece puzzles",
            "Understands concept of 'two'", "Copies a circle with crayon", "Names 4+ colors",
            "Understands counting to 5", "Sorts objects by size/shape", "Understands day/night",
            "Recalls parts of stories", "Follows 3-step instructions", "Understands 'same' and 'different'",
            "Engages in fantasy play", "Draws person with 2-3 parts", "Completes simple patterns"
        ],
        language: [
            "Follows 2-3 step instructions", "Names most familiar things", "Says first name, age, gender",
            "Understands prepositions (in, on, under)", "Speaks clearly most of the time", "Uses 3-4 word sentences",
            "Tells simple stories", "Knows 250-500 words", "Asks 'what/where/who' questions",
            "Uses plural words", "Sings nursery rhymes", "Uses past tense",
            "Describes what happened today", "Carries on conversations", "Understands 'big' vs 'little'"
        ],
        social: [
            "Takes turns in games", "Shows concern for crying friend", "Understands 'mine' and 'yours'",
            "Shows wide range of emotions", "Separates easily from parents", "Plays cooperatively with others",
            "Initiates play with peers", "Shows affection without prompting", "Follows simple group rules",
            "Expresses feelings verbally", "Plays dress-up and pretend", "Shows preference for certain friends",
            "Negotiates solutions to conflicts", "Shows pride in achievements", "Understands basic emotions in others"
        ],
        behavioral: [
            "Follows routines independently", "Helps with simple chores", "Waits turn with reminders",
            "Accepts redirection calmly", "Shows increasing self-control", "Uses words to express frustration",
            "Follows 2-3 rules consistently", "Transitions between activities smoothly", "Shows persistence with tasks",
            "Cleans up toys independently", "Shows table manners", "Uses toilet independently (day)",
            "Shows understanding of schedules", "Accepts 'no' without major tantrums", "Demonstrates emerging independence"
        ],
        moral: [
            "Shows empathy toward others", "Understands basic rules", "Apologizes with prompting",
            "Shows concern for fairness", "Distinguishes right from wrong", "Helps others in need",
            "Follows simple moral rules", "Shows guilt for misbehavior", "Shares with encouragement",
            "Understands 'taking turns'", "Shows kindness to younger children", "Follows instructions from authority",
            "Understands consequences", "Begins to understand honesty", "Shows emerging conscience"
        ]
    },
    "4": {
        physical: [
            "Hops on one foot multiple times", "Catches bounced ball most times", "Uses scissors to cut lines",
            "Draws person with 4+ body parts", "Pours and cuts with supervision", "Skips with practice",
            "Dresses independently", "Uses fork and spoon properly", "Draws squares and crosses",
            "Threads small beads", "Climbs with confidence", "Kicks ball with accuracy",
            "Runs smoothly with direction changes", "Builds complex block structures", "Uses pencil with proper grip"
        ],
        cognitive: [
            "Names 10+ colors", "Counts to 20", "Remembers parts of stories",
            "Understands 'same' and 'different'", "Plays board/card games", "Draws person with 6+ parts",
            "Understands time concepts (morning/afternoon)", "Follows 4-step instructions", "Sorts by multiple attributes",
            "Understands patterns", "Tells what comes next", "Engages in complex pretend play",
            "Understands quantity concepts", "Recalls 4-5 items", "Solves age-appropriate puzzles"
        ],
        language: [
            "Sings songs from memory", "Tells detailed stories", "Says first and last name",
            "Uses future tense", "Can say name and address", "Uses 1000+ words",
            "Speaks in 5-6 word sentences", "Uses 'and' and 'because'", "Tells jokes",
            "Asks 'why' questions", "Follows complex directions", "Describes events in detail",
            "Uses correct grammar mostly", "Rhymes words", "Participates in conversations"
        ],
        social: [
            "Enjoys new experiences", "Plays 'Mom' and 'Dad'", "Cooperates with other children",
            "Creative in make-believe play", "Prefers playing with others", "Negotiates with peers",
            "Shows understanding of others' feelings", "Takes turns without prompting", "Shows leadership in play",
            "Resolves conflicts verbally", "Shows empathy consistently", "Makes friends easily",
            "Understands social rules", "Shows pride in helping", "Plays complex group games"
        ],
        behavioral: [
            "Follows classroom rules", "Completes tasks independently", "Shows good self-regulation",
            "Manages frustration appropriately", "Follows multi-step routines", "Shows responsibility for belongings",
            "Demonstrates patience", "Accepts consequences", "Shows self-discipline",
            "Helps without being asked", "Shows persistence with challenges", "Follows safety rules",
            "Shows good hygiene habits", "Transitions easily between activities", "Demonstrates emerging leadership"
        ],
        moral: [
            "Understands fairness deeply", "Shows genuine empathy", "Tells truth (with reminders)",
            "Respects others' property", "Follows rules consistently", "Shows remorse for misbehavior",
            "Helps others spontaneously", "Understands concept of sharing", "Shows kindness to all",
            "Distinguishes fantasy from reality", "Understands consequences of actions", "Shows emerging sense of justice",
            "Respects authority figures", "Understands basic morality", "Shows conscience development"
        ]
    },
    "5": {
        physical: [
            "Stands on one foot 10+ seconds", "Hops and skips", "Uses fork, spoon, and knife",
            "Swings and climbs confidently", "May ride bike with training wheels", "Somersaults",
            "Draws detailed person", "Prints some letters/numbers", "Copies triangle and diamond",
            "Cuts with precision", "Ties shoelaces (with practice)", "Catches small ball",
            "Kicks ball with control", "Dresses completely independently", "Shows hand dominance"
        ],
        cognitive: [
            "Counts 20+ objects", "Draws person with 8+ body parts", "Prints letters and numbers",
            "Copies triangle shapes", "Understands time concepts (yesterday/tomorrow)", "Counts to 100",
            "Understands simple addition/subtraction", "Names days of week", "Identifies coins",
            "Understands left and right", "Follows 5-step directions", "Tells time to the hour",
            "Understands cause and effect", "Plans play sequences", "Shows logical thinking"
        ],
        language: [
            "Speaks very clearly", "Tells stories with full sentences", "Says name and full address",
            "Identifies all coins", "Answers questions about stories", "Uses 2000+ words",
            "Uses complex sentences", "Describes objects in detail", "Uses correct verb tenses",
            "Understands jokes and riddles", "Recites phone number", "Uses future and past tense correctly",
            "Engages in detailed conversations", "Tells jokes", "Understands 5000+ words"
        ],
        social: [
            "Wants to please friends", "Agrees with rules", "Likes to sing, dance, act",
            "Aware of gender differences", "Distinguishes real from make-believe", "Shows strong friendships",
            "Cooperates in groups", "Shows empathy consistently", "Resolves conflicts independently",
            "Shows leadership skills", "Understands social expectations", "Plays complex group games",
            "Shows concern for others", "Negotiates effectively", "Shows confidence in social settings"
        ],
        behavioral: [
            "Follows complex rules", "Shows good self-control", "Completes chores independently",
            "Manages emotions well", "Shows responsibility", "Follows multi-step routines without reminders",
            "Demonstrates patience", "Accepts disappointment appropriately", "Shows good classroom behavior",
            "Helps others willingly", "Shows persistence with difficult tasks", "Follows safety rules independently",
            "Shows good hygiene habits", "Manages time appropriately", "Demonstrates leadership behavior"
        ],
        moral: [
            "Understands right from wrong clearly", "Shows strong sense of fairness", "Tells truth consistently",
            "Respects others' property and rights", "Follows rules without reminders", "Shows genuine remorse",
            "Helps those in need", "Understands concept of justice", "Shows kindness to all",
            "Understands consequences deeply", "Shows strong conscience", "Makes moral judgments",
            "Respects authority appropriately", "Understands honesty importance", "Shows emerging moral reasoning"
        ]
    },
    "6": {
        physical: [
            "Jumps rope", "Rides bicycle independently", "Improved handwriting legibility",
            "Sports skills developing", "Good coordination in activities", "Runs with speed and control",
            "Hops on one foot easily", "Catches various ball sizes", "Uses tools with precision",
            "Draws with detail", "Writes letters and numbers correctly", "Dresses quickly",
            "Shows good balance", "Participates in organized sports", "Demonstrates fine motor control"
        ],
        cognitive: [
            "Beginning reading independently", "Simple math (addition/subtraction)", "Understands cause and effect deeply",
            "Improved memory recall", "Follows multi-step directions", "Reads simple books",
            "Writes simple sentences", "Counts to 100+", "Understands time to half-hour",
            "Sorts by multiple attributes", "Solves complex puzzles", "Understands seasons and holidays",
            "Shows logical reasoning", "Plans ahead for activities", "Understands simple fractions"
        ],
        language: [
            "Uses complex sentences", "Tells complete stories with sequence", "Answers questions appropriately",
            "Expanding vocabulary rapidly", "Uses correct grammar", "Reads 100+ sight words",
            "Writes complete sentences", "Follows complex instructions", "Understands figurative language",
            "Participates in discussions", "Retells stories accurately", "Uses descriptive language",
            "Understands 10000+ words", "Asks thoughtful questions", "Expresses ideas clearly"
        ],
        social: [
            "Understands teamwork", "Friendships very important", "Follows rules consistently",
            "Emotional control improving", "Shows deep empathy", "Works well in groups",
            "Shows leadership naturally", "Resolves peer conflicts", "Understands social hierarchies",
            "Shows loyalty to friends", "Cooperates in team activities", "Understands others' perspectives",
            "Shows appropriate assertiveness", "Makes and keeps friends", "Navigates social situations well"
        ],
        behavioral: [
            "Follows classroom rules independently", "Shows strong self-regulation", "Completes homework with minimal help",
            "Manages time appropriately", "Shows responsibility for actions", "Demonstrates good study habits",
            "Accepts constructive criticism", "Shows persistence with challenges", "Follows safety rules consistently",
            "Helps without being asked", "Shows good organizational skills", "Manages emotions maturely",
            "Demonstrates self-discipline", "Follows through on commitments", "Shows emerging independence"
        ],
        moral: [
            "Strong sense of right and wrong", "Shows deep empathy and compassion", "Honest in most situations",
            "Respects others' rights and property", "Follows rules even when unsupervised", "Shows genuine guilt for wrongdoing",
            "Helps others spontaneously", "Strong sense of fairness and justice", "Shows kindness consistently",
            "Understands moral consequences", "Strong conscience development", "Makes moral decisions independently",
            "Respects authority figures", "Understands importance of honesty", "Shows mature moral reasoning"
        ]
    },
    "7": {
        physical: [
            "Sports proficiency increasing", "Neat handwriting", "Uses tools properly and safely",
            "Good physical coordination", "Increased stamina", "Rides bike skillfully",
            "Swims with instruction", "Participates in team sports", "Shows good balance and agility",
            "Draws with perspective", "Writes in cursive (with practice)", "Ties shoes quickly",
            "Shows rhythm in movement", "Good hand-eye coordination", "Demonstrates physical confidence"
        ],
        cognitive: [
            "Reading fluency improving", "Math problem solving", "Logical thinking emerging",
            "Increased curiosity", "Organizes thoughts and materials", "Reads chapter books",
            "Writes paragraphs", "Understands multiplication concepts", "Tells time accurately",
            "Understands money concepts", "Solves multi-step problems", "Shows abstract thinking",
            "Plans and executes projects", "Understands cause and effect relationships", "Shows critical thinking"
        ],
        language: [
            "Speaks in different styles", "Detailed storytelling", "Understands humor and sarcasm",
            "Expresses opinions clearly", "Follows complex instructions", "Reads fluently",
            "Writes organized paragraphs", "Uses proper punctuation", "Participates in debates",
            "Understands idioms", "Gives oral presentations", "Uses persuasive language",
            "Vocabulary 20000+ words", "Understands multiple meanings", "Communicates effectively"
        ],
        social: [
            "Works well in diverse groups", "Shows leadership abilities", "Empathetic to others",
            "Problem solves with peers", "Understands fairness deeply", "Maintains close friendships",
            "Navigates social conflicts", "Shows awareness of others' feelings", "Cooperates in team settings",
            "Shows appropriate independence", "Understands social norms", "Shows loyalty in friendships",
            "Respects differences in others", "Demonstrates social confidence", "Shows emerging maturity"
        ],
        behavioral: [
            "Strong self-regulation", "Completes tasks independently", "Shows good time management",
            "Follows rules consistently", "Demonstrates responsibility", "Shows good study habits",
            "Manages frustration well", "Accepts feedback positively", "Shows organizational skills",
            "Helps others willingly", "Shows persistence with difficult tasks", "Follows safety rules",
            "Demonstrates self-discipline", "Shows good decision making", "Takes responsibility for actions"
        ],
        moral: [
            "Strong moral compass", "Shows deep empathy", "Honest and trustworthy",
            "Respects diversity", "Follows rules even when unsupervised", "Shows strong conscience",
            "Helps those in need", "Strong sense of justice", "Shows kindness to all",
            "Understands ethical concepts", "Makes moral judgments", "Respects authority",
            "Understands consequences of actions", "Shows integrity", "Emerging ethical reasoning"
        ]
    },
    "8": {
        physical: [
            "Competitive in sports", "Learns new physical skills quickly", "High energy levels",
            "Fine motor skills refined", "Growing independence in self-care", "Participates in organized sports",
            "Shows good coordination", "Writes neatly and quickly", "Uses tools skillfully",
            "Draws with detail and accuracy", "Shows good physical stamina", "Demonstrates athletic abilities",
            "Good balance and agility", "Participates in physical activities enthusiastically", "Shows hand dominance clearly"
        ],
        cognitive: [
            "Analytical thinking", "Plans ahead effectively", "Strong memory skills",
            "Creative expression", "Abstract concepts emerging", "Reads complex texts",
            "Writes multi-paragraph essays", "Understands fractions and decimals", "Solves complex problems",
            "Shows logical reasoning", "Conducts simple research", "Understands multiple perspectives",
            "Shows critical thinking", "Organizes information well", "Demonstrates independent learning"
        ],
        language: [
            "Engages in debates", "Discusses various topics knowledgeably", "Understands complex jokes",
            "Follows complex directions", "Writes organized paragraphs", "Reads at advanced level",
            "Uses sophisticated vocabulary", "Gives detailed presentations", "Understands figurative language",
            "Uses persuasive techniques", "Participates in group discussions", "Expresses complex ideas",
            "Understands multiple meanings", "Uses appropriate tone", "Communicates with confidence"
        ],
        social: [
            "Peer relationships crucial", "Understands social norms deeply", "Self-esteem developing",
            "Cooperative skills advanced", "Accepts responsibility", "Maintains multiple friendships",
            "Navigates complex social situations", "Shows leadership in groups", "Understands social dynamics",
            "Shows empathy consistently", "Resolves conflicts independently", "Respects others' opinions",
            "Shows loyalty in friendships", "Demonstrates social maturity", "Understands group dynamics"
        ],
        behavioral: [
            "Excellent self-regulation", "Completes complex tasks independently", "Shows strong time management",
            "Follows rules without reminders", "Demonstrates responsibility consistently", "Shows excellent study habits",
            "Manages emotions maturely", "Accepts criticism constructively", "Shows strong organizational skills",
            "Helps others proactively", "Shows grit and persistence", "Follows safety protocols",
            "Demonstrates strong self-discipline", "Makes good decisions", "Shows leadership in behavior"
        ],
        moral: [
            "Well-developed moral compass", "Shows deep and consistent empathy", "Trustworthy and honest",
            "Respects all individuals", "Follows rules based on understanding", "Strong conscience",
            "Helps others selflessly", "Deep sense of fairness and justice", "Shows consistent kindness",
            "Understands complex ethical issues", "Makes principled decisions", "Respects legitimate authority",
            "Understands long-term consequences", "Shows strong integrity", "Demonstrates ethical reasoning"
        ]
    },
    "9": {
        physical: [
            "Athletic skills improving", "Increased endurance", "Tries new physical activities",
            "Early puberty signs possible", "Good body control", "Excels in specific sports",
            "Shows physical confidence", "Fine motor skills excellent", "Uses tools with precision",
            "Draws and writes with skill", "Shows good physical coordination", "Participates in competitive sports",
            "Demonstrates physical strength", "Shows good balance", "Takes care of personal hygiene independently"
        ],
        cognitive: [
            "Critical thinking developed", "Research skills improving", "Completes projects independently",
            "Abstract reasoning strong", "Problem solving strategies advanced", "Reads and analyzes complex texts",
            "Writes well-structured essays", "Understands advanced math concepts", "Solves multi-step problems",
            "Shows strong logical reasoning", "Conducts independent research", "Understands multiple viewpoints",
            "Shows advanced critical thinking", "Organizes complex information", "Demonstrates self-directed learning"
        ],
        language: [
            "Effective communication", "Writing proficiency advanced", "Learns from multiple sources",
            "Gives polished presentations", "Persuasive speaking", "Reads at advanced level",
            "Uses sophisticated vocabulary", "Understands complex texts", "Participates in debates skillfully",
            "Uses language appropriately in contexts", "Expresses complex ideas clearly", "Understands nuanced language",
            "Writes creatively and analytically", "Uses proper grammar consistently", "Communicates with confidence and clarity"
        ],
        social: [
            "Identity exploration", "Group belonging important", "Takes responsibility for actions",
            "Emotional ups and downs", "Strong friendships", "Navigates peer pressure",
            "Shows leadership in groups", "Understands complex social dynamics", "Shows empathy consistently",
            "Resolves conflicts maturely", "Respects diverse perspectives", "Shows loyalty in friendships",
            "Demonstrates social awareness", "Understands social hierarchies", "Shows emerging maturity in relationships"
        ],
        behavioral: [
            "Excellent self-regulation", "Completes complex projects independently", "Shows strong time management skills",
            "Follows rules consistently", "Demonstrates responsibility", "Shows excellent organizational skills",
            "Manages emotions maturely", "Accepts feedback constructively", "Shows strong self-discipline",
            "Helps others proactively", "Shows persistence with challenges", "Makes good decisions independently",
            "Demonstrates leadership behavior", "Follows through on commitments", "Shows strong work ethic"
        ],
        moral: [
            "Strong moral compass", "Shows deep empathy consistently", "Trustworthy and honest",
            "Respects diversity and inclusion", "Follows rules based on understanding", "Strong conscience",
            "Helps others selflessly", "Deep sense of justice", "Shows consistent kindness to all",
            "Understands complex ethical dilemmas", "Makes principled decisions", "Respects authority appropriately",
            "Understands consequences deeply", "Shows strong integrity", "Demonstrates mature ethical reasoning"
        ]
    },
    "10": {
        physical: [
            "Early puberty signs common", "Competitive in sports", "Uses energy appropriately",
            "Learns complex physical skills", "Good coordination", "Excels in chosen sports",
            "Shows physical confidence", "Fine motor skills highly refined", "Uses tools expertly",
            "Draws and writes with skill", "Shows excellent physical coordination", "Participates in competitive activities",
            "Demonstrates physical strength", "Shows good balance and agility", "Maintains personal hygiene independently"
        ],
        cognitive: [
            "Solves complex problems", "Long-term planning abilities", "Analyzes information critically",
            "Decision making improved", "Independent learning strong", "Reads and analyzes advanced texts",
            "Writes sophisticated essays", "Understands advanced mathematics", "Solves multi-step complex problems",
            "Shows excellent logical reasoning", "Conducts thorough research", "Understands multiple perspectives deeply",
            "Shows advanced critical thinking", "Organizes complex information efficiently", "Demonstrates self-directed learning mastery"
        ],
        language: [
            "Effective discussions on complex topics", "Mature writing style", "Debates various topics skillfully",
            "Persuasive skills advanced", "Comprehends complex texts", "Reads at advanced level",
            "Uses sophisticated vocabulary extensively", "Understands nuanced language", "Gives polished presentations",
            "Uses language appropriately in all contexts", "Expresses complex ideas eloquently", "Understands figurative language deeply",
            "Writes creatively and analytically", "Uses proper grammar consistently", "Communicates with confidence and sophistication"
        ],
        social: [
            "Deep friendships important", "Moral values developing", "Independence growing",
            "Social awareness strong", "Peer influence significant", "Navigates complex social situations",
            "Shows leadership in multiple contexts", "Understands social dynamics deeply", "Shows consistent empathy",
            "Resolves conflicts maturely", "Respects diverse perspectives", "Shows strong loyalty in friendships",
            "Demonstrates social maturity", "Understands group dynamics", "Shows emerging adult-like relationships"
        ],
        behavioral: [
            "Excellent self-regulation", "Completes complex long-term projects independently", "Shows strong time management",
            "Follows rules consistently", "Demonstrates high responsibility", "Shows excellent organizational skills",
            "Manages emotions maturely", "Accepts criticism constructively", "Shows strong self-discipline",
            "Helps others proactively and consistently", "Shows exceptional persistence", "Makes sound decisions independently",
            "Demonstrates leadership behavior consistently", "Follows through on all commitments", "Shows excellent work ethic"
        ],
        moral: [
            "Strong moral compass well-developed", "Shows deep and consistent empathy", "Highly trustworthy and honest",
            "Deeply respects diversity and inclusion", "Follows rules based on strong understanding", "Strong conscience guides actions",
            "Helps others selflessly and consistently", "Deep commitment to justice", "Shows consistent kindness to everyone",
            "Understands complex ethical dilemmas deeply", "Makes principled decisions consistently", "Respects legitimate authority appropriately",
            "Understands long-term consequences thoroughly", "Shows exceptional integrity", "Demonstrates mature ethical reasoning"
        ]
    }
};

// ============================================================
// GLOBAL STATE
// ============================================================
let state = {
    currentProfile: null,
    profiles: [],
    usageCount: 0,
    reactions: {},
    categoryChart: null,
    progressChart: null,
    recognition: null,
    isDark: true
};

// ============================================================
// DOM REFS
// ============================================================
const $ = id => document.getElementById(id);
const dom = {
    toast: $('toastContainer'),
    usage: $('usageCount'),
    heroUsage: $('heroUsage'),
    heroChildren: $('heroChildren'),
    heroMilestones: $('heroMilestones'),
    reactions: $('reactionsContainer'),
    profileSelector: $('profileSelector'),
    childName: $('childName'),
    childAge: $('childAge'),
    childGender: $('childGender'),
    displayName: $('displayChildName'),
    displayInfo: $('displayChildInfo'),
    avatarUpload: $('avatarUpload'),
    avatarInput: $('avatarInput'),
    saveChild: $('saveChildInfo'),
    addProfile: $('addNewProfile'),
    ageTabs: $('ageTabs'),
    milestoneGrid: $('milestoneGridContainer'),
    progressFill: $('progressFill'),
    overallProgress: $('overallProgress'),
    modal: $('reportModal'),
    modalClose: $('closeModal'),
    reportChildName: $('reportChildName'),
    reportDate: $('reportDate'),
    modalCompletion: $('modalCompletionRate'),
    reportGrid: $('reportGrid'),
    generateReport: $('generateReport'),
    downloadWord: $('downloadWord'),
    resetChecklist: $('resetChecklist'),
    shareReport: $('shareReport'),
    modalDownloadWord: $('modalDownloadWord'),
    printReport: $('printReport'),
    chatInput: $('chatInput'),
    chatMessages: $('chatMessages'),
    sendMessage: $('sendMessage'),
    voiceInput: $('voiceInput'),
    closeChat: $('closeChat'),
    minimizeChat: $('minimizeChat'),
    aiChat: $('aiChat'),
    chatHeader: $('chatHeader'),
    darkModeToggle: $('darkModeToggle'),
    scrollUp: $('scrollUpBtn'),
    scrollDown: $('scrollDownBtn'),
    pageShare: $('pageShareBtn'),
    backHome: $('backHomeBtn'),
    typewriter: $('typewriterText'),
    scrollToTool: $('scrollToTool'),
    learnMore: $('learnMoreBtn')
};

// ============================================================
// CATEGORY HELPERS
// ============================================================
const CATEGORIES = ['physical', 'cognitive', 'language', 'social', 'behavioral', 'moral'];
const CATEGORY_NAMES = {
    physical: 'Physical',
    cognitive: 'Cognitive',
    language: 'Language',
    social: 'Social & Emotional',
    behavioral: 'Behavioral',
    moral: 'Moral'
};
const CATEGORY_ICONS = {
    physical: 'fa-running',
    cognitive: 'fa-brain',
    language: 'fa-comments',
    social: 'fa-users',
    behavioral: 'fa-heart',
    moral: 'fa-balance-scale'
};
const CATEGORY_COLORS = {
    physical: '#ff6b6b',
    cognitive: '#4ecdc4',
    language: '#45b7d1',
    social: '#f9ca24',
    behavioral: '#a29bfe',
    moral: '#fd79a8'
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    dom.toast.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function getStorageKey(profileId, age, category, index) {
    return `profile-${profileId}-milestone-${age}-${category}-${index}`;
}

function getProfileKey(id) {
    return `profile-${id}`;
}

function getReactionsKey() {
    return `reactions_${CONFIG.TOOL_SLUG}`;
}

function getUserReactedKey(emoji) {
    return `user_reacted_${CONFIG.TOOL_SLUG}_${emoji}`;
}

// ============================================================
// API SERVICES
// ============================================================
const API = {
    async incrementUsage() {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/usage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': CONFIG.API_KEY
                },
                body: JSON.stringify({
                    tool_slug: CONFIG.TOOL_SLUG,
                    tool_name: CONFIG.TOOL_NAME,
                    category: CONFIG.CATEGORY
                })
            });
            if (!response.ok) throw new Error('API failed');
            const data = await response.json();
            return data;
        } catch (error) {
            console.warn('API usage increment failed, using fallback:', error);
            return this._fallbackUsage();
        }
    },

    _fallbackUsage() {
        const key = `usage_${CONFIG.TOOL_SLUG}`;
        const count = parseInt(localStorage.getItem(key) || '0');
        const newCount = count + 1;
        localStorage.setItem(key, newCount);
        return { usage: newCount };
    },

    async getStats() {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, {
                headers: { 'X-API-Key': CONFIG.API_KEY }
            });
            if (!response.ok) throw new Error('API failed');
            const data = await response.json();
            return data;
        } catch (error) {
            console.warn('API stats failed, using fallback:', error);
            return this._fallbackStats();
        }
    },

    _fallbackStats() {
        const usage = parseInt(localStorage.getItem(`usage_${CONFIG.TOOL_SLUG}`) || '0');
        const reactions = JSON.parse(localStorage.getItem(getReactionsKey()) || '{}');
        const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
        const shares = parseInt(localStorage.getItem(`shares_${CONFIG.TOOL_SLUG}`) || '0');
        return {
            usage,
            views: usage,
            shares,
            followers: totalReactions,
            reactions: reactions
        };
    },

    async recordReaction(emoji) {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/reactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': CONFIG.API_KEY
                },
                body: JSON.stringify({
                    tool_slug: CONFIG.TOOL_SLUG,
                    reaction: emoji
                })
            });
            if (!response.ok) throw new Error('API failed');
            return await response.json();
        } catch (error) {
            console.warn('API reaction failed, using fallback:', error);
            return this._fallbackReaction(emoji);
        }
    },

    _fallbackReaction(emoji) {
        const key = getReactionsKey();
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        data[emoji] = (data[emoji] || 0) + 1;
        localStorage.setItem(key, JSON.stringify(data));
        return data;
    },

    async recordShare(platform) {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/shares`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': CONFIG.API_KEY
                },
                body: JSON.stringify({
                    tool_slug: CONFIG.TOOL_SLUG,
                    platform: platform
                })
            });
            if (!response.ok) throw new Error('API failed');
            return await response.json();
        } catch (error) {
            console.warn('API share failed, using fallback:', error);
            return this._fallbackShare(platform);
        }
    },

    _fallbackShare(platform) {
        const key = `shares_${CONFIG.TOOL_SLUG}`;
        const count = parseInt(localStorage.getItem(key) || '0');
        localStorage.setItem(key, count + 1);
        return { shares: count + 1 };
    },

    async getReactions() {
        try {
            const response = await fetch(`${CONFIG.API_BASE}/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`, {
                headers: { 'X-API-Key': CONFIG.API_KEY }
            });
            if (!response.ok) throw new Error('API failed');
            return await response.json();
        } catch (error) {
            console.warn('API get reactions failed, using fallback:', error);
            return JSON.parse(localStorage.getItem(getReactionsKey()) || '{}');
        }
    }
};

// ============================================================
// TYPEWRITER EFFECT
// ============================================================
const typewriterTexts = [
    'Developmental Milestones',
    'Child Development',
    'Growth & Learning',
    '6 Key Domains',
    'Ages 2–10 Years',
    'AI-Powered Insights'
];

let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewriterEffect() {
    const currentText = typewriterTexts[typewriterIndex];
    const speed = isDeleting ? 40 : 80;
    
    if (!isDeleting && charIndex <= currentText.length) {
        dom.typewriter.textContent = currentText.substring(0, charIndex);
        charIndex++;
        if (charIndex > currentText.length) {
            setTimeout(() => { isDeleting = true; }, 2000);
            setTimeout(typewriterEffect, 300);
            return;
        }
    } else if (isDeleting && charIndex >= 0) {
        dom.typewriter.textContent = currentText.substring(0, charIndex);
        charIndex--;
        if (charIndex < 0) {
            isDeleting = false;
            typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
            setTimeout(typewriterEffect, 500);
            return;
        }
    }
    setTimeout(typewriterEffect, speed);
}

// ============================================================
// PROFILES
// ============================================================
function loadProfiles() {
    const saved = localStorage.getItem('childProfiles');
    state.profiles = saved ? JSON.parse(saved) : [];
    renderProfileSelector();
}

function saveProfiles() {
    localStorage.setItem('childProfiles', JSON.stringify(state.profiles));
}

function renderProfileSelector() {
    dom.profileSelector.innerHTML = '';
    state.profiles.forEach(profile => {
        const chip = document.createElement('div');
        chip.className = `profile-chip ${state.currentProfile === profile.id ? 'active' : ''}`;
        chip.innerHTML = `
            <i class="fas fa-child"></i>
            <span>${profile.name}</span>
            <i class="fas fa-times" data-profile-id="${profile.id}" style="margin-left:6px;cursor:pointer;"></i>
        `;
        chip.addEventListener('click', (e) => {
            if (!e.target.classList.contains('fa-times')) {
                loadProfile(profile.id);
            }
        });
        chip.querySelector('.fa-times').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteProfile(profile.id);
        });
        dom.profileSelector.appendChild(chip);
    });
}

function loadProfile(profileId) {
    const profile = state.profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    state.currentProfile = profileId;
    dom.childName.value = profile.name;
    dom.childAge.value = profile.age;
    dom.childGender.value = profile.gender;
    dom.displayName.textContent = profile.name;
    dom.displayInfo.textContent = `Age: ${profile.age} years`;
    
    if (profile.avatar) {
        dom.avatarUpload.innerHTML = `<img src="${profile.avatar}"><input type="file" id="avatarInput" accept="image/*">`;
        dom.avatarInput = document.getElementById('avatarInput');
        dom.avatarInput.addEventListener('change', handleAvatarUpload);
    } else {
        dom.avatarUpload.innerHTML = `<i class="fas fa-user-circle"></i><input type="file" id="avatarInput" accept="image/*">`;
        dom.avatarInput = document.getElementById('avatarInput');
        dom.avatarInput.addEventListener('change', handleAvatarUpload);
    }
    
    loadMilestones();
    updateStats();
    renderProfileSelector();
    updateCharts();
}

function deleteProfile(profileId) {
    if (!confirm('Delete this profile?')) return;
    state.profiles = state.profiles.filter(p => p.id !== profileId);
    saveProfiles();
    
    // Clean up localStorage
    for (let age = 2; age <= 10; age++) {
        CATEGORIES.forEach(cat => {
            milestoneData[age]?.[cat]?.forEach((_, i) => {
                localStorage.removeItem(getStorageKey(profileId, age, cat, i));
            });
        });
    }
    localStorage.removeItem(getProfileKey(profileId));
    localStorage.removeItem(`profile-${profileId}-history`);
    
    if (state.profiles.length) {
        loadProfile(state.profiles[0].id);
    } else {
        state.currentProfile = null;
        dom.displayName.textContent = "Child's Name";
        dom.displayInfo.textContent = 'Age: Not set';
        dom.childName.value = '';
        loadMilestones();
        updateStats();
    }
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const avatarData = ev.target.result;
        if (state.currentProfile) {
            const profile = state.profiles.find(p => p.id === state.currentProfile);
            if (profile) {
                profile.avatar = avatarData;
                saveProfiles();
                dom.avatarUpload.innerHTML = `<img src="${avatarData}"><input type="file" id="avatarInput" accept="image/*">`;
                dom.avatarInput = document.getElementById('avatarInput');
                dom.avatarInput.addEventListener('change', handleAvatarUpload);
            }
        }
    };
    reader.readAsDataURL(file);
}

// ============================================================
// MILESTONES
// ============================================================
function loadMilestones() {
    const age = dom.childAge.value;
    document.querySelectorAll('.age-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.age === age);
    });
    
    dom.milestoneGrid.innerHTML = '';
    
    CATEGORIES.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'milestone-category-card';
        card.innerHTML = `
            <div class="category-header ${cat}">
                <i class="fas ${CATEGORY_ICONS[cat]}"></i> ${CATEGORY_NAMES[cat]}
            </div>
            <div class="milestone-items-list" id="${cat}Milestones"></div>
            <div class="category-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="${cat}ProgressFill" style="width:0%"></div>
                </div>
                <p><span id="${cat}Completed">0</span>/<span id="${cat}Total">0</span> completed</p>
            </div>
        `;
        dom.milestoneGrid.appendChild(card);
        
        const list = document.getElementById(`${cat}Milestones`);
        const milestones = milestoneData[age]?.[cat] || [];
        
        milestones.forEach((text, i) => {
            const key = state.currentProfile ? getStorageKey(state.currentProfile, age, cat, i) : `milestone-${age}-${cat}-${i}`;
            const isCompleted = localStorage.getItem(key) === 'true';
            
            const item = document.createElement('div');
            item.className = `milestone-item ${isCompleted ? 'completed' : ''}`;
            item.innerHTML = `
                <input type="checkbox" class="milestone-checkbox" id="${key}" ${isCompleted ? 'checked' : ''}>
                <label class="milestone-text" for="${key}">${text}</label>
            `;
            list.appendChild(item);
        });
    });
    
    updateStats();
    if (state.currentProfile) updateCharts();
}

// ============================================================
// STATS
// ============================================================
function updateStats() {
    const age = dom.childAge.value;
    let totalCompleted = 0, totalMilestones = 0;
    
    CATEGORIES.forEach(cat => {
        let completed = 0;
        const total = milestoneData[age]?.[cat]?.length || 0;
        
        milestoneData[age]?.[cat]?.forEach((_, i) => {
            const key = state.currentProfile ? getStorageKey(state.currentProfile, age, cat, i) : `milestone-${age}-${cat}-${i}`;
            if (localStorage.getItem(key) === 'true') completed++;
        });
        
        totalCompleted += completed;
        totalMilestones += total;
        const rate = total ? Math.round((completed / total) * 100) : 0;
        
        const progressEl = document.getElementById(`${cat}Progress`);
        const completedEl = document.getElementById(`${cat}Completed`);
        const totalEl = document.getElementById(`${cat}Total`);
        const fillEl = document.getElementById(`${cat}ProgressFill`);
        
        if (progressEl) progressEl.textContent = `${rate}%`;
        if (completedEl) completedEl.textContent = completed;
        if (totalEl) totalEl.textContent = total;
        if (fillEl) fillEl.style.width = `${rate}%`;
    });
    
    const overallRate = totalMilestones ? Math.round((totalCompleted / totalMilestones) * 100) : 0;
    dom.overallProgress.textContent = `${overallRate}%`;
    dom.progressFill.style.width = `${overallRate}%`;
    
    // Save history
    if (state.currentProfile) {
        const historyKey = `profile-${state.currentProfile}-history`;
        const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
        const today = new Date().toLocaleDateString();
        if (!history.length || history[history.length-1].date !== today) {
            history.push({ date: today, rate: overallRate });
            if (history.length > 30) history.shift();
            localStorage.setItem(historyKey, JSON.stringify(history));
        }
    }
}

// ============================================================
// CHARTS
// ============================================================
function initCharts() {
    const ctx1 = document.getElementById('categoryChart').getContext('2d');
    const ctx2 = document.getElementById('progressChart').getContext('2d');
    
    state.categoryChart = new Chart(ctx1, {
        type: 'radar',
        data: {
            labels: Object.values(CATEGORY_NAMES),
            datasets: [{
                label: 'Completion Rate (%)',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(102, 126, 234, 0.15)',
                borderColor: 'rgba(102, 126, 234, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#a0a0c8', backdropColor: 'transparent' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    pointLabels: { color: '#f0f0ff', font: { size: 11 } }
                }
            },
            plugins: {
                legend: { labels: { color: '#a0a0c8' } }
            }
        }
    });
    
    state.progressChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Progress Over Time (%)',
                data: [],
                borderColor: '#a29bfe',
                backgroundColor: 'rgba(162, 155, 254, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#a29bfe',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#a0a0c8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { color: '#a0a0c8', maxRotation: 45 },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            },
            plugins: {
                legend: { labels: { color: '#a0a0c8' } }
            }
        }
    });
}

function updateCharts() {
    if (!state.currentProfile) return;
    const age = dom.childAge.value;
    
    const data = CATEGORIES.map(cat => {
        let completed = 0;
        const total = milestoneData[age]?.[cat]?.length || 0;
        milestoneData[age]?.[cat]?.forEach((_, i) => {
            if (localStorage.getItem(getStorageKey(state.currentProfile, age, cat, i)) === 'true') completed++;
        });
        return total ? Math.round((completed / total) * 100) : 0;
    });
    
    state.categoryChart.data.datasets[0].data = data;
    state.categoryChart.update();
    
    const historyKey = `profile-${state.currentProfile}-history`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    if (history.length) {
        state.progressChart.data.labels = history.map(h => h.date);
        state.progressChart.data.datasets[0].data = history.map(h => h.rate);
        state.progressChart.update();
    }
}

// ============================================================
// REACTIONS
// ============================================================
async function initReactions() {
    dom.reactions.innerHTML = '';
    const reactions = CONFIG.REACTIONS;
    const data = await API.getReactions();
    
    reactions.forEach(emoji => {
        const count = data[emoji] || 0;
        const userReacted = localStorage.getItem(getUserReactedKey(emoji)) === 'true';
        
        const btn = document.createElement('button');
        btn.className = `reaction-btn ${userReacted ? 'active' : ''}`;
        btn.innerHTML = `${emoji} <span class="count">${count}</span>`;
        
        btn.addEventListener('click', async () => {
            if (localStorage.getItem(getUserReactedKey(emoji))) {
                showToast('You already reacted!', 'error');
                return;
            }
            
            const result = await API.recordReaction(emoji);
            const newCount = result[emoji] || (count + 1);
            btn.querySelector('.count').textContent = newCount;
            btn.classList.add('active');
            localStorage.setItem(getUserReactedKey(emoji), 'true');
            showToast(`Reacted with ${emoji}!`);
        });
        
        dom.reactions.appendChild(btn);
    });
}

// ============================================================
// SHARING
// ============================================================
async function handleShare(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this amazing Developmental Milestone Tracker! 🌟');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'copy':
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast('🔗 Link copied!');
            } catch {
                prompt('Copy this link:', window.location.href);
            }
            await API.recordShare('copy');
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        await API.recordShare(platform);
        showToast(`Shared on ${platform}!`);
    }
}

// ============================================================
// USAGE COUNTER
// ============================================================
async function updateUsage() {
    const result = await API.incrementUsage();
    state.usageCount = result.usage || parseInt(localStorage.getItem(`usage_${CONFIG.TOOL_SLUG}`) || '0');
    dom.usage.textContent = state.usageCount;
    dom.heroUsage.textContent = state.usageCount;
}

async function updateHeroStats() {
    const stats = await API.getStats();
    dom.heroUsage.textContent = stats.usage || state.usageCount;
    dom.heroChildren.textContent = Math.max(1, Math.floor((stats.usage || 0) / 5));
    dom.heroMilestones.textContent = '120+';
}

// ============================================================
// REPORT
// ============================================================
function generateFullReport() {
    if (!state.currentProfile) {
        showToast('Please save a profile first', 'error');
        return;
    }
    
    const profile = state.profiles.find(p => p.id === state.currentProfile);
    const age = profile.age;
    
    dom.reportChildName.textContent = `${profile.name}'s Developmental Report (${age} years)`;
    dom.reportDate.textContent = `Date: ${new Date().toLocaleDateString()}`;
    
    dom.reportGrid.innerHTML = '';
    let totalCompleted = 0, totalMilestones = 0;
    
    CATEGORIES.forEach(cat => {
        let completed = 0;
        const total = milestoneData[age]?.[cat]?.length || 0;
        const completedItems = [];
        const pendingItems = [];
        
        milestoneData[age]?.[cat]?.forEach((text, i) => {
            const key = getStorageKey(state.currentProfile, age, cat, i);
            if (localStorage.getItem(key) === 'true') {
                completed++;
                completedItems.push(text);
            } else {
                pendingItems.push(text);
            }
        });
        
        totalCompleted += completed;
        totalMilestones += total;
        
        const card = document.createElement('div');
        card.className = `report-category-card ${cat}`;
        card.innerHTML = `
            <h3><i class="fas ${CATEGORY_ICONS[cat]}"></i> ${CATEGORY_NAMES[cat]}</h3>
            <p><strong>${completed}/${total} completed (${total ? Math.round(completed/total*100) : 0}%)</strong></p>
            <h4>✓ Completed:</h4>
            <ul class="report-milestone-list">${completedItems.map(m => `<li><i class="fas fa-check-circle"></i> ${m}</li>`).join('') || '<li>None yet</li>'}</ul>
            <h4>○ Pending:</h4>
            <ul class="report-milestone-list">${pendingItems.map(m => `<li><i class="far fa-circle"></i> ${m}</li>`).join('') || '<li>All completed!</li>'}</ul>
        `;
        dom.reportGrid.appendChild(card);
    });
    
    const overallRate = totalMilestones ? Math.round((totalCompleted / totalMilestones) * 100) : 0;
    dom.modalCompletion.textContent = `${overallRate}% Complete`;
    
    dom.modal.style.display = 'flex';
}

function generateWordReport() {
    if (!state.currentProfile) {
        showToast('Please save a profile first', 'error');
        return;
    }
    
    const profile = state.profiles.find(p => p.id === state.currentProfile);
    const age = profile.age;
    
    let content = `DEVELOPMENTAL MILESTONE REPORT\n`;
    content += `Child: ${profile.name} | Age: ${age} years | Gender: ${profile.gender}\n`;
    content += `Date: ${new Date().toLocaleDateString()}\n`;
    content += `${'='.repeat(60)}\n\n`;
    
    let totalCompleted = 0, totalMilestones = 0;
    
    CATEGORIES.forEach(cat => {
        let completed = 0;
        const total = milestoneData[age]?.[cat]?.length || 0;
        
        content += `${CATEGORY_NAMES[cat].toUpperCase()}\n${'-'.repeat(40)}\n`;
        
        milestoneData[age]?.[cat]?.forEach((text, i) => {
            const key = getStorageKey(state.currentProfile, age, cat, i);
            const isDone = localStorage.getItem(key) === 'true';
            if (isDone) completed++;
            content += `${isDone ? '[✓]' : '[ ]'} ${text}\n`;
        });
        
        totalCompleted += completed;
        totalMilestones += total;
        content += `\nProgress: ${completed}/${total} (${total ? Math.round(completed/total*100) : 0}%)\n\n`;
    });
    
    content += `${'='.repeat(60)}\n`;
    content += `OVERALL PROGRESS: ${totalCompleted}/${totalMilestones} (${totalMilestones ? Math.round(totalCompleted/totalMilestones*100) : 0}%)\n`;
    content += `\nGenerated by MagicRills Developmental Milestone Tracker`;
    
    const blob = new Blob([content], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${profile.name}-developmental-report.doc`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Word report downloaded!');
}

// ============================================================
// AI CHAT
// ============================================================
function sendChatMessage() {
    const msg = dom.chatInput.value.trim();
    if (!msg) return;
    
    dom.chatMessages.innerHTML += `<div class="message user"><i class="fas fa-user"></i> ${msg}</div>`;
    dom.chatInput.value = '';
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    
    // Simulated AI response
    const responses = [
        "That's a great question! Let me help you understand child development better.",
        "Developmental milestones are important markers of growth. Keep tracking!",
        "Every child develops at their own pace. Focus on progress, not perfection.",
        "I recommend consulting with a pediatrician if you have concerns about milestones.",
        "Great job tracking your child's development! Consistency is key.",
        "The 6 domains cover all aspects of child development. Which one interests you most?"
    ];
    
    setTimeout(() => {
        const response = responses[Math.floor(Math.random() * responses.length)];
        dom.chatMessages.innerHTML += `<div class="message ai"><i class="fas fa-robot"></i> ${response}</div>`;
        dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    }, 800);
}

function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
        state.recognition = new webkitSpeechRecognition();
        state.recognition.continuous = false;
        state.recognition.interimResults = false;
        state.recognition.lang = 'en-US';
        state.recognition.onresult = (e) => {
            dom.chatInput.value = e.results[0][0].transcript;
            sendChatMessage();
        };
    }
    
    dom.voiceInput.addEventListener('click', () => {
        if (state.recognition) {
            dom.voiceInput.classList.toggle('recording');
            if (dom.voiceInput.classList.contains('recording')) {
                state.recognition.start();
            } else {
                state.recognition.stop();
            }
        } else {
            showToast('Voice recognition not supported', 'error');
        }
    });
}

// ============================================================
// DARK MODE
// ============================================================
function toggleDarkMode() {
    state.isDark = !state.isDark;
    document.body.classList.toggle('light-mode');
    dom.darkModeToggle.innerHTML = state.isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('darkMode', state.isDark);
}

// ============================================================
// SCROLL BUTTONS
// ============================================================
function initScrollButtons() {
    window.addEventListener('scroll', () => {
        dom.scrollUp.classList.toggle('visible', window.scrollY > 300);
        dom.scrollDown.classList.toggle('visible', window.scrollY < document.body.scrollHeight - window.innerHeight - 100);
    });
    
    dom.scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    dom.scrollDown.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

// ============================================================
// EVENT LISTENERS
// ============================================================
function initEventListeners() {
    // Profile
    dom.saveChild.addEventListener('click', () => {
        const name = dom.childName.value.trim();
        if (!name) { showToast('Please enter a name', 'error'); return; }
        const age = dom.childAge.value;
        const gender = dom.childGender.value;
        
        if (state.currentProfile) {
            const p = state.profiles.find(p => p.id === state.currentProfile);
            if (p) { p.name = name; p.age = age; p.gender = gender; }
        } else {
            const np = { id: Date.now().toString(), name, age, gender };
            state.profiles.push(np);
            state.currentProfile = np.id;
        }
        saveProfiles();
        dom.displayName.textContent = name;
        dom.displayInfo.textContent = `Age: ${age} years`;
        renderProfileSelector();
        showToast('Profile saved!');
    });
    
    dom.addProfile.addEventListener('click', () => {
        dom.childName.value = '';
        state.currentProfile = null;
        dom.displayName.textContent = "Child's Name";
        dom.displayInfo.textContent = 'Age: Not set';
        dom.avatarUpload.innerHTML = `<i class="fas fa-user-circle"></i><input type="file" id="avatarInput" accept="image/*">`;
        dom.avatarInput = document.getElementById('avatarInput');
        dom.avatarInput.addEventListener('change', handleAvatarUpload);
        loadMilestones();
    });
    
    dom.avatarUpload.addEventListener('click', () => dom.avatarInput?.click());
    
    // Age tabs
    dom.ageTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.age-tab');
        if (tab) {
            dom.childAge.value = tab.dataset.age;
            loadMilestones();
        }
    });
    
    // Checklist
    dom.milestoneGrid.addEventListener('change', (e) => {
        if (e.target.classList.contains('milestone-checkbox')) {
            localStorage.setItem(e.target.id, e.target.checked);
            e.target.closest('.milestone-item').classList.toggle('completed', e.target.checked);
            updateStats();
            if (state.currentProfile) updateCharts();
        }
    });
    
    // Reset
    dom.resetChecklist.addEventListener('click', () => {
        if (!confirm('Reset all milestones for this age?')) return;
        const age = dom.childAge.value;
        const prefix = state.currentProfile ? `profile-${state.currentProfile}-milestone-${age}` : `milestone-${age}`;
        CATEGORIES.forEach(cat => {
            milestoneData[age]?.[cat]?.forEach((_, i) => {
                localStorage.removeItem(`${prefix}-${cat}-${i}`);
            });
        });
        loadMilestones();
        showToast('Checklist reset');
    });
    
    // Reports
    dom.generateReport.addEventListener('click', generateFullReport);
    dom.downloadWord.addEventListener('click', generateWordReport);
    dom.modalDownloadWord.addEventListener('click', () => {
        generateWordReport();
        dom.modal.style.display = 'none';
    });
    dom.printReport.addEventListener('click', () => window.print());
    dom.modalClose.addEventListener('click', () => dom.modal.style.display = 'none');
    dom.modal.addEventListener('click', (e) => {
        if (e.target === dom.modal) dom.modal.style.display = 'none';
    });
    
    dom.shareReport.addEventListener('click', () => {
        generateFullReport();
        setTimeout(() => dom.modal.style.display = 'flex', 100);
    });
    
    // Social share
    document.querySelectorAll('.social-icon').forEach(btn => {
        btn.addEventListener('click', () => handleShare(btn.dataset.platform));
    });
    
    // Page share
    dom.pageShare.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('🔗 Link copied!');
        } catch {
            prompt('Copy this link:', window.location.href);
        }
        await API.recordShare('copy');
    });
    
    dom.backHome.addEventListener('click', () => window.location.href = '/');
    
    // Chat
    dom.sendMessage.addEventListener('click', sendChatMessage);
    dom.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
    dom.closeChat.addEventListener('click', () => dom.aiChat.style.display = 'none');
    dom.minimizeChat.addEventListener('click', () => dom.aiChat.classList.toggle('minimized'));
    dom.chatHeader.addEventListener('click', (e) => {
        if (!e.target.closest('button')) dom.aiChat.classList.toggle('minimized');
    });
    
    // Dark mode
    dom.darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Scroll to tool
    dom.scrollToTool.addEventListener('click', () => {
        document.querySelector('.dashboard').scrollIntoView({ behavior: 'smooth' });
    });
    
    dom.learnMore.addEventListener('click', () => {
        document.querySelector('.milestone-grid-container').scrollIntoView({ behavior: 'smooth' });
    });
}

// ============================================================
// INIT
// ============================================================
async function init() {
    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'false') {
        state.isDark = false;
        document.body.classList.add('light-mode');
        dom.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Start typewriter
    typewriterEffect();
    
    // Load data
    loadProfiles();
    initCharts();
    initScrollButtons();
    initVoiceRecognition();
    initEventListeners();
    
    // Load profile or default
    if (state.profiles.length) {
        loadProfile(state.profiles[0].id);
    } else {
        loadMilestones();
        updateStats();
    }
    
    // API calls
    await updateUsage();
    await updateHeroStats();
    await initReactions();
    
    // Child count for hero
    const profileCount = state.profiles.length || 1;
    dom.heroChildren.textContent = profileCount;
    
    showToast('✨ Welcome! Track milestones across 6 developmental domains.', 'info');
}

// Start app
document.addEventListener('DOMContentLoaded', init);
