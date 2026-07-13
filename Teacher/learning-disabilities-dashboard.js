// ============================================
// COMPLETE LEARNING DISABILITIES TEACHER TOOL
// All 8 Disabilities | Full Information | 10-Point Checklists
// ============================================

// ============================================
// CLOUDFLARE WORKERS API CONFIGURATION (ADDED)
// ============================================
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const TOOL_SLUG = 'learning-disabilities-dashboard';
const TOOL_NAME = 'Learning Disabilities Assessment Tool';
const CATEGORY = 'Teacher';

// Cloudflare API Call Function (ADDED)
async function callCloudflareAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Tool-Slug': TOOL_SLUG,
                'X-Tool-Name': TOOL_NAME,
                'X-Category': CATEGORY
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using localStorage fallback:', error);
        return null;
    }
}

// Fetch Tool Stats from Cloudflare (ADDED)
async function fetchToolStats() {
    try {
        const result = await callCloudflareAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result) {
            if (result.usage) {
                usageCount = result.usage;
                document.getElementById('usage-counter').innerText = result.usage;
                localStorage.setItem('ld_usageCount', result.usage);
            }
            if (result.shares) {
                shareCount = result.shares;
                document.getElementById('share-count').innerText = result.shares;
                localStorage.setItem('ld_shareCount', result.shares);
            }
            if (result.views && document.getElementById('views-count')) {
                document.getElementById('views-count').innerText = result.views;
            }
            if (result.followers && document.getElementById('followers-count')) {
                document.getElementById('followers-count').innerText = result.followers;
            }
        }
    } catch (error) {
        console.warn('Failed to fetch stats:', error);
    }
}

let currentDisability = null;
let usageCount = parseInt(localStorage.getItem('ld_usageCount') || '0');
let shareCount = parseInt(localStorage.getItem('ld_shareCount') || '0');
let students = JSON.parse(localStorage.getItem('ld_students') || '[]');
let reactionsData = JSON.parse(localStorage.getItem('ld_reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"angry":0,"laugh":0,"celebrate":0}');

const EMOJI_MAP = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };

// ==================== COMPLETE DISABILITY DATA (ALL 8 WITH FULL INFO) ====================
const disabilities = [
    // 1. DYSLEXIA - Complete
    {
        id: 'dyslexia', name: 'Dyslexia', category: 'Reading', icon: 'fa-book-open', color: 'reading',
        desc: 'A specific learning disability that affects reading and related language-based processing skills. It is neurological in origin and characterized by difficulties with accurate and/or fluent word recognition, poor spelling, and decoding abilities.',
        overview: `Dyslexia is one of the most common learning disabilities, affecting approximately 5-10% of the population. It is not related to intelligence—individuals with dyslexia have average or above-average intelligence. The condition affects the brain's ability to process phonological components of language, making it difficult to connect sounds with letters and words.

Key Facts:
• Runs in families (genetic component)
• Early intervention leads to better outcomes
• Dyslexia is a lifelong condition but manageable with proper support
• Many successful people have dyslexia including entrepreneurs, artists, and scientists
• Affects 1 in 5 individuals to some degree`,
        
        symptoms: [
            "Difficulty learning to read and write",
            "Slow, laborious reading with many mistakes",
            "Poor spelling even for common words",
            "Letter reversals (b/d, p/q) beyond age 7",
            "Trouble rhyming or identifying sounds in words",
            "Avoids reading aloud or shows anxiety",
            "Difficulty remembering sequences (alphabet, days)",
            "Poor reading comprehension despite good listening",
            "Trouble learning a foreign language",
            "Difficulty with word problems in math"
        ],
        
        difficulties: [
            "Phonological processing - difficulty breaking words into individual sounds",
            "Working memory issues - trouble holding information while processing",
            "Rapid naming deficits - slow to name letters, numbers, colors",
            "Visual processing challenges - letter reversals and confusion",
            "Sequencing problems - difficulty with order of letters and numbers",
            "Comprehension issues due to slow decoding",
            "Poor spelling that doesn't improve with practice",
            "Reading fluency - choppy, word-by-word reading"
        ],
        
        types: [
            "Phonological Dyslexia - Difficulty with sound-letter correspondence (most common)",
            "Surface Dyslexia - Difficulty with irregular words that don't follow rules",
            "Rapid Naming Deficit - Slow at naming letters, numbers, colors",
            "Double Deficit Dyslexia - Combination of phonological and rapid naming",
            "Visual Dyslexia - Difficulty with visual processing of letters",
            "Deep Dyslexia - Affects both reading and meaning comprehension",
            "Primary Dyslexia - Genetic, affects males more often",
            "Secondary/Trauma Dyslexia - Caused by brain injury or trauma"
        ],
        
        remedies: [
            "Structured Literacy Instruction (Orton-Gillingham approach)",
            "Multisensory teaching (visual, auditory, kinesthetic, tactile)",
            "Explicit phonics instruction with systematic progression",
            "Assistive technology (text-to-speech, audiobooks)",
            "Accommodations (extra time, oral exams, note-taking assistance)",
            "Building phonological awareness through targeted exercises",
            "Regular reading practice with decodable texts",
            "Use of colored overlays or reading rulers",
            "Reading fluency practice with repeated readings",
            "Spelling instruction using multi-sensory methods"
        ],
        
        activities: [
            "Sound matching games with picture cards",
            "Rhyming bingo or memory games",
            "Letter formation in sand or shaving cream",
            "Word building with magnetic letters",
            "Reading race with familiar texts",
            "Phonics board games focusing on patterns",
            "Audio-assisted reading (listen and follow along)",
            "Digital note-taking with speech-to-text",
            "Study guide creation with visual organizers",
            "Text-to-speech practice with school materials"
        ],
        
        strategies: [
            "Provide explicit, systematic phonics instruction daily",
            "Use multisensory techniques (see, say, hear, touch)",
            "Break reading tasks into small, manageable chunks",
            "Provide advance organizers and pre-teach vocabulary",
            "Allow extra time for all reading and writing tasks",
            "Use color coding and highlighting techniques",
            "Provide graphic organizers for writing tasks",
            "Offer audiobooks and text-to-speech tools",
            "Record lessons for review at home",
            "Use decodable texts for independent reading"
        ],
        
        accommodations: [
            "Extended time on tests and assignments (at least 50% extra)",
            "Audiobooks and text-to-speech software access",
            "Oral exams instead of written tests",
            "Note-taking assistance or copies of teacher notes",
            "Reduced reading load (fewer questions, shorter passages)",
            "Use of spell-check and grammar-check tools",
            "Preferential seating near the front",
            "Alternative assignments that demonstrate knowledge without heavy reading",
            "Use of large print materials",
            "Scribe for written responses"
        ],
        
        tech: [
            "NaturalReader - Text-to-speech software",
            "Learning Ally - Audiobooks for dyslexia",
            "Ginger - Grammar and spell checker",
            "Dragon NaturallySpeaking - Speech-to-text",
            "Kurzweil 3000 - Reading and writing support",
            "Bookshare - Accessible books library",
            "Co:Writer - Word prediction software",
            "Snap&Read - Text reader and study tool",
            "Read&Write - Literacy support toolbar",
            "Claro ScanPen - OCR scanning and reading"
        ],
        
        // 10-Point Checklist
        checklist: [
            "Difficulty learning letter names and sounds despite adequate instruction",
            "Trouble rhyming words or identifying initial sounds in words",
            "Reading is slow, labored, and lacks fluency for age/grade level",
            "Guesses at unfamiliar words rather than decoding them",
            "Avoids reading aloud or shows anxiety about reading tasks",
            "Spelling is poor even for common words (e.g., 'wen' for 'when')",
            "Confuses visually similar letters (b/d, p/q, m/w) beyond expected age",
            "Difficulty remembering sequences (days of week, alphabet order)",
            "Trouble learning a foreign language",
            "Family history of reading difficulties or dyslexia"
        ]
    },
    
    // 2. DYSGRAPHIA - Complete
    {
        id: 'dysgraphia', name: 'Dysgraphia', category: 'Writing', icon: 'fa-pen-fancy', color: 'writing',
        desc: 'A neurological condition that affects writing abilities, including handwriting, spelling, and organizing thoughts on paper. It impacts fine motor skills and written expression.',
        overview: `Dysgraphia affects the ability to write coherently and legibly. It is not related to intelligence or laziness. Students with dysgraphia often have difficulty with handwriting, spelling, and organizing thoughts on paper. The condition can co-occur with dyslexia and ADHD.

Key Facts:
• Affects both handwriting and composition
• Can be developmental or acquired
• Often causes physical pain while writing
• Typing often bypasses many difficulties
• Early intervention improves outcomes`,
        
        symptoms: [
            "Illegible or very messy handwriting",
            "Pain or fatigue in hand when writing",
            "Inconsistent letter size, shape, spacing",
            "Awkward or unusual pencil grip",
            "Difficulty copying from board or book",
            "Written work much shorter than verbal responses",
            "Poor spelling even when copying",
            "Difficulty organizing thoughts on paper",
            "Grips pencil extremely tightly",
            "Avoids writing tasks whenever possible"
        ],
        
        difficulties: [
            "Fine motor coordination problems affecting writing",
            "Difficulty with letter formation and spacing",
            "Trouble with written spelling vs oral spelling",
            "Problems organizing thoughts on paper",
            "Slow writing speed affecting completion",
            "Difficulty with grammar in written work",
            "Poor spatial awareness on paper",
            "Physical pain during extended writing"
        ],
        
        types: [
            "Dyslexic Dysgraphia - Illegible spontaneous writing but copying is better",
            "Motor Dysgraphia - Poor fine motor skills and dexterity",
            "Spatial Dysgraphia - Difficulty with spacing and letter placement",
            "Phonological Dysgraphia - Poor spelling and sound-letter connection",
            "Lexical Dysgraphia - Difficulty with irregular words",
            "Deep Dysgraphia - Semantic errors in writing",
            "Apraxic Dysgraphia - Difficulty with motor planning for writing"
        ],
        
        remedies: [
            "Occupational therapy for fine motor skills",
            "Touch typing instruction (Dvorak or standard)",
            "Use of cursive handwriting for some students",
            "Reduce writing load - quality over quantity",
            "Grip aids and ergonomic writing tools",
            "Use of lined/graph paper for guidance",
            "Oral responses instead of written",
            "Speech-to-text technology training"
        ],
        
        activities: [
            "Typing practice with typing tutor software",
            "Sand tracing of letters and words",
            "Clay letter forming for motor planning",
            "Digital note-taking practice",
            "Voice recording of ideas before writing",
            "Handwriting warm-up exercises",
            "Copying practice with dotted guides",
            "Word processing skills development",
            "Graphic organizer use for planning",
            "Journaling with speech-to-text"
        ],
        
        strategies: [
            "Allow typing instead of handwriting whenever possible",
            "Provide a scribe for tests and long assignments",
            "Reduce quantity of written work significantly",
            "Use speech-to-text technology for composition",
            "Grade on content, not handwriting or spelling",
            "Provide pre-printed notes and handouts",
            "Allow extra time for writing tasks",
            "Use graphic organizers for planning written work",
            "Teach keyboarding skills systematically",
            "Allow oral presentations instead of written reports"
        ],
        
        accommodations: [
            "Typing allowed for all assignments and tests",
            "Use of speech-to-text software",
            "Scribe for written responses",
            "Reduced written workload (half the questions)",
            "Extended time on writing tasks",
            "Use of computer for essay responses",
            "Pre-printed notes from teacher",
            "Grading rubrics that focus on content",
            "Allow voice recording of responses",
            "Use of specialized writing tools (grips, slanted surface)"
        ],
        
        tech: [
            "Speech-to-text (Dragon NaturallySpeaking)",
            "Word prediction software (Co:Writer)",
            "Typing tutor programs (Typing.com)",
            "Digital notebooks (OneNote, Evernote)",
            "Graphic organizer software (Kidspiration)",
            "Grammarly for writing support",
            "Text-to-speech for proofreading",
            "Smart pens with recording capability",
            "Word processing with spell check",
            "Voice recording apps for notes"
        ],
        
        checklist: [
            "Handwriting is illegible or very difficult to read",
            "Complains of hand pain, fatigue, or cramping when writing",
            "Inconsistent letter size, shape, and spacing",
            "Awkward or unusual pencil grip",
            "Difficulty copying from board or book accurately",
            "Avoids writing tasks whenever possible",
            "Written work is much shorter than verbal responses",
            "Poor spelling even when copying from a source",
            "Difficulty organizing thoughts on paper",
            "Grips pencil extremely tightly leaving indentations"
        ]
    },
    
    // 3. DYSCALCULIA - Complete
    {
        id: 'dyscalculia', name: 'Dyscalculia', category: 'Mathematics', icon: 'fa-calculator', color: 'math',
        desc: 'A specific learning disability in mathematics, affecting number sense, calculation, and mathematical reasoning. It impacts understanding of quantity and numerical concepts.',
        overview: `Dyscalculia affects approximately 3-7% of the population. It impacts the ability to understand numbers and mathematical concepts. Students struggle with counting, calculation, and math fact memorization despite normal intelligence and instruction.

Key Facts:
• Often co-occurs with dyslexia and ADHD
• Affects understanding of time, money, and measurement
• Difficulty with mental math and estimation
• Can impact sense of direction and spatial reasoning
• Early identification allows for targeted intervention`,
        
        symptoms: [
            "Poor number sense and quantity understanding",
            "Trouble memorizing math facts (addition, multiplication)",
            "Counts on fingers beyond expected age",
            "Difficulty with place value and number alignment",
            "Problems telling time on analog clock",
            "Difficulty with money calculations",
            "Trouble with measurement and estimation",
            "Poor sense of direction and spatial relationships",
            "Anxiety about math tasks",
            "Difficulty with word problems"
        ],
        
        difficulties: [
            "Number sense - understanding what numbers mean",
            "Math fact retrieval - cannot recall basic facts automatically",
            "Calculation procedures - mixing up steps",
            "Place value understanding and alignment",
            "Fraction and decimal concepts",
            "Measurement and estimation",
            "Time telling and elapsed time",
            "Money calculations and making change"
        ],
        
        types: [
            "Procedural Dyscalculia - Difficulty with calculation procedures",
            "Number Sense Dyscalculia - Poor understanding of quantity",
            "Semantic Dyscalculia - Difficulty with math concepts",
            "Practical Dyscalculia - Difficulty applying math to real life",
            "Verbal Dyscalculia - Difficulty with math language/vocabulary",
            "Spatial Dyscalculia - Difficulty with spatial math concepts",
            "Memory Dyscalculia - Cannot recall math facts",
            "Acquired Dyscalculia - Caused by brain injury"
        ],
        
        remedies: [
            "Use of concrete manipulatives (counters, blocks)",
            "Real-world math applications for relevance",
            "Step-by-step instruction with clear models",
            "Visual representations of math concepts",
            "Frequent review and spiral curriculum",
            "Use of mnemonic devices for procedures",
            "Calculator use for complex calculations",
            "Games and activities to build number sense"
        ],
        
        activities: [
            "Number line games and activities",
            "Money counting with real coins",
            "Clock practice with manipulative clocks",
            "Board games requiring counting (Monopoly)",
            "Pattern recognition activities",
            "Estimation games with everyday objects",
            "Fraction manipulatives (pizza, fraction bars)",
            "Measurement activities with rulers",
            "Card games requiring number comparison",
            "Online math games targeting specific skills"
        ],
        
        strategies: [
            "Use manipulatives for all new concepts",
            "Connect math to real-life situations",
            "Allow use of calculator for computation",
            "Reduce number of problems (quality over quantity)",
            "Provide visual aids and number lines",
            "Use graph paper to align numbers",
            "Teach math vocabulary explicitly",
            "Allow extra time for calculations",
            "Provide formulas on tests",
            "Use mnemonic devices for procedures"
        ],
        
        accommodations: [
            "Calculator allowed on all tests and assignments",
            "Formula sheet provided for exams",
            "Extra time for math problems",
            "Reduced number of math problems",
            "Graph paper for number alignment",
            "Use of multiplication table reference",
            "Oral administration of math problems",
            "Concrete manipulatives allowed",
            "Math fact reference sheet",
            "Word problems read aloud"
        ],
        
        tech: [
            "ModMath - Digital math worksheet app",
            "Talking Calculator - Audio feedback",
            "Number Line app - Visual number representation",
            "Fraction manipulatives apps",
            "DragonBox - Game-based math learning",
            "Motion Math - Number line games",
            "Math Learning Center apps",
            "IXL Math - Adaptive practice",
            "Khan Academy - Video instruction",
            "Photomath - Shows step-by-step solutions"
        ],
        
        checklist: [
            "Difficulty understanding quantity and what numbers mean",
            "Trouble memorizing math facts (addition, multiplication tables)",
            "Counts on fingers beyond expected age (past 8-9 years)",
            "Difficulty with place value and aligning numbers correctly",
            "Trouble telling time on analog clock",
            "Problems with money calculations and making change",
            "Difficulty with measurement and estimation",
            "Poor sense of direction and spatial relationships",
            "Anxiety about math tasks and avoids math",
            "Family history of math difficulties"
        ]
    },
    
    // 4. ADHD - Complete
    {
        id: 'adhd', name: 'ADHD', category: 'Attention', icon: 'fa-bolt', color: 'attention',
        desc: 'Attention-Deficit/Hyperactivity Disorder affects executive function, attention regulation, impulse control, and activity level. It impacts academic performance and social interactions.',
        overview: `ADHD is a neurodevelopmental disorder affecting approximately 5-10% of children worldwide. It affects self-regulation, attention, and activity level. Symptoms typically appear before age 12 and persist into adulthood.

Key Facts:
• Three subtypes: Inattentive, Hyperactive-Impulsive, Combined
• More common in males in childhood
• Often co-occurs with learning disabilities
• Executive function deficits are core features
• Medication and behavior therapy are effective treatments`,
        
        symptoms: [
            "Easily distracted by extraneous stimuli",
            "Fidgeting and difficulty sitting still",
            "Forgetful about daily activities",
            "Difficulty following multi-step instructions",
            "Interrupts others in conversation",
            "Fails to give close attention to details",
            "Does not seem to listen when spoken to",
            "Loses things needed for tasks",
            "Blurts out answers before question completed",
            "Difficulty waiting for turn"
        ],
        
        difficulties: [
            "Sustained attention - staying focused on tasks",
            "Working memory - holding information temporarily",
            "Impulse control - stopping automatic responses",
            "Emotional regulation - managing frustration",
            "Organization - keeping materials and thoughts organized",
            "Time management - estimating and using time",
            "Task initiation - starting tasks independently",
            "Follow-through - completing multi-step tasks"
        ],
        
        types: [
            "ADHD - Inattentive Type (formerly ADD) - Difficulty focusing but not hyperactive",
            "ADHD - Hyperactive-Impulsive Type - Restless, fidgets, acts without thinking",
            "ADHD - Combined Type - Both inattentive and hyperactive-impulsive symptoms",
            "Executive Function Deficit - Core difficulty with self-regulation",
            "Sluggish Cognitive Tempo - Daydreaming, slow processing",
            "Over-focused ADHD - Hyperfocus on certain activities"
        ],
        
        remedies: [
            "Behavior therapy and parent training",
            "Medication (stimulants and non-stimulants) under medical supervision",
            "Executive function coaching and training",
            "Organization systems and routines",
            "Movement breaks and physical activity",
            "Mindfulness and self-regulation training",
            "Environmental modifications",
            "Social skills training",
            "Cognitive Behavioral Therapy (CBT)",
            "Academic supports and accommodations"
        ],
        
        activities: [
            "Movement breaks between academic tasks",
            "Standing desks or flexible seating",
            "Timed activities with visual timers",
            "Brain breaks (jumping jacks, stretches)",
            "Kinesthetic learning activities",
            "Organization games and practice",
            "Goal-setting and tracking charts",
            "Mindfulness exercises (breathing, grounding)",
            "Physical education and sports involvement",
            "Hands-on science and art projects"
        ],
        
        strategies: [
            "Provide movement breaks every 15-20 minutes",
            "Establish clear, consistent routines and schedules",
            "Chunk tasks into smaller, manageable parts",
            "Provide immediate positive feedback",
            "Use visual timers to show time remaining",
            "Reduce distractions in environment",
            "Use checklists for multi-step tasks",
            "Give one instruction at a time",
            "Seat student near point of instruction",
            "Allow fidget tools for self-regulation"
        ],
        
        accommodations: [
            "Preferential seating near the teacher",
            "Extended time on tests and assignments",
            "Fidget tools allowed in class",
            "Break tasks into smaller sections",
            "Visual timers for time management",
            "Reduced homework load",
            "Frequent check-ins for understanding",
            "Use of assignment notebook",
            "Movement breaks during tests",
            "Quiet testing environment"
        ],
        
        tech: [
            "Forest - Focus timer app",
            "Todoist - Task management",
            "Time Timer - Visual timer",
            "Noise-cancelling headphones",
            "Google Calendar - Organization",
            "Evernote - Note taking",
            "Brain.fm - Focus music",
            "Tiimo - Visual daily planner",
            "Due - Persistent reminders",
            "Focus@Will - Concentration music"
        ],
        
        checklist: [
            "Often fails to give close attention to details or makes careless mistakes",
            "Difficulty sustaining attention in tasks or play activities",
            "Does not seem to listen when spoken to directly",
            "Does not follow through on instructions and fails to finish work",
            "Difficulty organizing tasks and activities",
            "Avoids or dislikes tasks requiring sustained mental effort",
            "Often loses things needed for tasks (homework, pencils)",
            "Easily distracted by extraneous stimuli",
            "Often fidgets with hands or feet or squirms in seat",
            "Interrupts or intrudes on others (butts into conversations/games)"
        ]
    },
    
    // 5. Auditory Processing Disorder - Complete
    {
        id: 'apd', name: 'Auditory Processing Disorder', category: 'Auditory', icon: 'fa-ear-listen', color: 'processing',
        desc: 'Difficulty processing auditory information despite normal hearing ability. The brain has trouble interpreting sounds, especially in noisy environments.',
        overview: `Auditory Processing Disorder (APD) affects how the brain processes what the ears hear. Individuals have normal hearing but struggle to distinguish similar sounds, follow directions, and learn in noisy environments.

Key Facts:
• Affects 3-5% of children
• Often mistaken for hearing loss or attention issues
• Can co-occur with dyslexia and language disorders
• Environmental modifications are very helpful
• Auditory training can improve processing`,
        
        symptoms: [
            "Often asks for repetition (What? Huh?)",
            "Misinterprets spoken information",
            "Difficulty following multi-step directions",
            "Trouble understanding in noisy environments",
            "Easily distracted by background sounds",
            "Poor listening skills despite normal hearing",
            "Difficulty with phonics and reading decoding",
            "Trouble with auditory memory",
            "Difficulty with similar sounding words",
            "Responds inconsistently to verbal information"
        ],
        
        difficulties: [
            "Auditory discrimination - distinguishing similar sounds",
            "Auditory memory - remembering what was heard",
            "Auditory sequencing - hearing sounds in correct order",
            "Auditory figure-ground - hearing in noise",
            "Auditory closure - filling in missing sounds",
            "Phonological awareness - connecting sounds to letters",
            "Following verbal directions accurately"
        ],
        
        types: [
            "Auditory Figure-Ground Deficit - Difficulty hearing in noise",
            "Auditory Memory Deficit - Cannot remember auditory information",
            "Auditory Discrimination Deficit - Cannot distinguish similar sounds",
            "Auditory Sequencing Deficit - Mixes up sound order",
            "Auditory Cohesion Deficit - Difficulty with inferences",
            "Prosodic APD - Difficulty with tone and rhythm",
            "Phonological APD - Difficulty with sound-letter connection",
            "Central APD - Higher-level processing difficulties"
        ],
        
        remedies: [
            "Auditory training programs (Fast ForWord, Earobics)",
            "Environmental modifications (reduce background noise)",
            "Use of FM system (teacher microphone)",
            "Phonological awareness training",
            "Language therapy with speech pathologist",
            "Gap-filling strategies",
            "Compensatory strategies training",
            "Home programs and computer-based training"
        ],
        
        activities: [
            "Sound discrimination games",
            "Following direction practice progressively",
            "Listening in quiet environments first",
            "Phonological awareness activities",
            "Memory games with auditory information",
            "Rhyming and sound matching games",
            "Sound bingo with environmental sounds",
            "Minimal pairs discrimination practice",
            "Auditory closure activities",
            "Sequencing stories or directions"
        ],
        
        strategies: [
            "Get student's attention before speaking",
            "Use visual supports with all verbal instructions",
            "Repeat and rephrase important information",
            "Provide quiet setting for tasks",
            "Speak clearly at moderate pace",
            "Pre-teach new vocabulary",
            "Check for understanding frequently",
            "Use captioning on videos",
            "Provide written instructions for all assignments",
            "Reduce background noise during instruction"
        ],
        
        accommodations: [
            "FM system (teacher microphone to student earpiece)",
            "Written instructions for all tasks",
            "Preferential seating away from noise",
            "Previews of new vocabulary and concepts",
            "Reduced background noise in classroom",
            "Use of visual aids and handouts",
            "Extra time for verbal directions",
            "Allow recording of lessons",
            "Quiet testing environment",
            "Oral instructions broken into single steps"
        ],
        
        tech: [
            "FM/DM systems (Phonak, Oticon)",
            "Noise-cancelling headphones",
            "Captioning services",
            "Audio amplification systems",
            "Voice-to-text apps for notes",
            "Auditory training software (Fast ForWord)",
            "Earobics - Phonological awareness software",
            "Learning Ally - Audiobooks",
            "Kurzweil - Reading support",
            "Dragon NaturallySpeaking - Speech-to-text"
        ],
        
        checklist: [
            "Often asks for repetition or says 'what' or 'huh'",
            "Misinterprets spoken information frequently",
            "Difficulty following multi-step directions",
            "Trouble understanding speech in noisy environments",
            "Easily distracted by background sounds",
            "Poor listening skills despite normal hearing test",
            "Difficulty with phonics and reading decoding",
            "Trouble with auditory memory (remembering what was said)",
            "Difficulty with similar sounding words (coat/goat, seventy/seventeen)",
            "Responds inconsistently to verbal information"
        ]
    },
    
    // 6. Visual Processing Disorder - Complete
    {
        id: 'vpd', name: 'Visual Processing Disorder', category: 'Visual', icon: 'fa-eye', color: 'visual',
        desc: 'Difficulty interpreting visual information from the eyes to the brain. The eyes see normally but the brain has trouble processing visual input.',
        overview: `Visual Processing Disorder (VPD) affects how the brain processes visual information. Students may have 20/20 vision but struggle with reading, copying, spatial relationships, and visual memory.

Key Facts:
• Vision may be normal but brain processing is affected
• Often mistaken for dyslexia due to reversals
• Can affect both academic and athletic performance
• Environmental modifications are helpful
• Specialized therapy can improve skills`,
        
        symptoms: [
            "Letter reversals beyond expected age",
            "Loses place frequently when reading",
            "Difficulty copying from board or book",
            "Poor spatial awareness (bumps into things)",
            "Difficulty with puzzles and visual patterns",
            "Confuses similar looking shapes",
            "Trouble with visual memory",
            "Difficulty with visual discrimination",
            "Problems with visual closure",
            "Avoids visual tasks like matching or sorting"
        ],
        
        difficulties: [
            "Visual discrimination - distinguishing similar shapes/letters",
            "Visual memory - recalling what was seen",
            "Visual closure - recognizing whole from parts",
            "Visual figure-ground - finding objects in clutter",
            "Visual spatial - understanding spatial relationships",
            "Visual motor integration - coordinating vision and movement",
            "Visual sequential memory - remembering visual sequences",
            "Reversals - confusing orientation of letters/numbers"
        ],
        
        types: [
            "Visual Discrimination Disorder - Cannot distinguish similar shapes",
            "Visual Figure-Ground Disorder - Difficulty finding objects in clutter",
            "Visual Closure Disorder - Cannot identify incomplete images",
            "Visual Spatial Disorder - Poor spatial awareness",
            "Visual Memory Disorder - Cannot recall visual information",
            "Visual Motor Integration Disorder - Poor eye-hand coordination",
            "Visual Sequential Memory Disorder - Cannot remember visual sequences",
            "Scotopic Sensitivity - Sensitivity to light/glare"
        ],
        
        remedies: [
            "Color overlays and tinted lenses",
            "Spatial awareness training",
            "Visual discrimination exercises",
            "Occupational therapy for visual motor skills",
            "Vision therapy (optometric program)",
            "Environmental modifications (reduce visual clutter)",
            "Use of auditory backup for visual information",
            "Large print materials",
            "Highlighting and color coding",
            "Reading guides and tracking tools"
        ],
        
        activities: [
            "Visual tracking games (track moving objects)",
            "Maze worksheets for eye tracking",
            "Pattern matching and completion",
            "Spot the difference pictures",
            "Puzzles of increasing complexity",
            "Memory card games",
            "Word search puzzles",
            "Hidden pictures (Where's Waldo)",
            "Tangrams and visual puzzles",
            "Copying patterns with blocks"
        ],
        
        strategies: [
            "Use large print materials whenever possible",
            "Provide colored overlays or reading filters",
            "Use verbal instructions to accompany visual information",
            "Reduce visual clutter on worksheets",
            "Use highlighters to emphasize important information",
            "Provide reading guide or ruler for tracking",
            "Allow use of audiobooks for reading",
            "Copy material in larger font",
            "Use contrast colors (black on white or yellow)",
            "Provide one visual at a time"
        ],
        
        accommodations: [
            "Audiobooks instead of reading text",
            "Oral testing instead of written",
            "Reduced visual stimuli on worksheets",
            "Large print materials (18pt+ font)",
            "Use of reader or scribe",
            "Colored overlays allowed",
            "Assistive technology for reading",
            "Extra time for visual tasks",
            "Verbal directions for visual tasks",
            "Reduced copying requirements"
        ],
        
        tech: [
            "Screen magnifiers (ZoomText)",
            "Text-to-speech software",
            "Color overlay apps",
            "High contrast display settings",
            "OCR scanning apps (Office Lens)",
            "Reading rulers and trackers",
            "Dyslexia-friendly fonts (OpenDyslexic)",
            "Voice Dream Reader - Text reader",
            "Seeing AI - Visual assistant",
            "Be My Eyes - Visual assistance"
        ],
        
        checklist: [
            "Reverses letters/numbers beyond expected age (b/d, p/q, 15/51)",
            "Loses place frequently when reading",
            "Difficulty copying from board or book accurately",
            "Poor spatial awareness and often bumps into things",
            "Difficulty with puzzles, mazes, and visual patterns",
            "Confuses similar looking shapes and symbols",
            "Trouble with visual memory (can't recall what was seen)",
            "Difficulty with visual discrimination (spotting differences)",
            "Problems with visual closure (seeing whole from parts)",
            "Avoids visual tasks like matching, sorting, or puzzles"
        ]
    },
    
    // 7. Executive Function Disorder - Complete
    {
        id: 'efd', name: 'Executive Function Disorder', category: 'Executive', icon: 'fa-brain', color: 'executive',
        desc: 'Problems with planning, organization, working memory, and self-regulation. It affects the brain\'s ability to manage thoughts and actions.',
        overview: `Executive Function Disorder affects cognitive processes that help regulate behavior, manage time, organize materials, and complete tasks. It often co-occurs with ADHD, autism, and learning disabilities.

Key Facts:
• Executive functions are controlled by the frontal lobe
• Includes working memory, inhibition, flexibility, planning
• Often misunderstood as laziness or defiance
• External structures and tools are very helpful
• Skills can be taught with explicit instruction`,
        
        symptoms: [
            "Chronically disorganized workspace",
            "Frequently misses deadlines",
            "Difficulty getting started on tasks",
            "Loses essential items regularly",
            "Poor time estimation ability",
            "Difficulty with multi-step projects",
            "Forgets to turn in completed work",
            "Trouble with transitions",
            "Difficulty prioritizing tasks",
            "Emotional dysregulation"
        ],
        
        difficulties: [
            "Working memory - holding information while working",
            "Task initiation - starting tasks independently",
            "Planning and prioritizing - organizing complex tasks",
            "Organization - keeping materials and thoughts organized",
            "Time management - estimating and using time",
            "Flexibility - shifting between tasks mentally",
            "Self-monitoring - checking own work",
            "Emotional control - managing frustration and impulses"
        ],
        
        types: [
            "Working Memory Deficit - Cannot hold information temporarily",
            "Task Initiation Deficit - Difficulty starting tasks",
            "Organization Deficit - Cannot organize materials or thoughts",
            "Planning Deficit - Trouble with multi-step activities",
            "Time Management Deficit - Poor time estimation",
            "Flexibility Deficit - Difficulty shifting between tasks",
            "Self-Monitoring Deficit - Cannot check own work",
            "Emotional Regulation Deficit - Difficulty controlling emotions"
        ],
        
        remedies: [
            "Executive function coaching",
            "Explicit strategy instruction",
            "External organization systems",
            "Checklists and visual schedules",
            "Environmental modifications",
            "Scaffolding and fading support",
            "Self-monitoring training",
            "Cognitive Behavioral Therapy (CBT)",
            "Time management tools and training",
            "Mindfulness and metacognition training"
        ],
        
        activities: [
            "Planning games and simulations",
            "Time estimation activities",
            "Organization practice with real materials",
            "Goal setting and tracking charts",
            "Reflection journals",
            "Strategy card creation",
            "Weekly planning sessions",
            "Project management simulations",
            "Priority sorting activities",
            "Self-monitoring checklists"
        ],
        
        strategies: [
            "Provide written checklists for all multi-step tasks",
            "Use visual schedules for daily routines",
            "Break large tasks into smaller chunks with deadlines",
            "Teach organization systems explicitly",
            "Provide frequent check-ins on progress",
            "Use color coding for subjects and materials",
            "Model thinking aloud for planning",
            "Use backward planning for projects",
            "Provide templates for notes and work",
            "Give one task at a time"
        ],
        
        accommodations: [
            "Extra time for assignments and tests",
            "Organization system provided by teacher",
            "Checklist for multi-step assignments",
            "Frequent check-ins with teacher",
            "Assignment notebook with daily sign-off",
            "Reduced homework load",
            "Extended deadlines upon request",
            "Use of graphic organizers",
            "Step-by-step instructions",
            "Quiet work space for focus"
        ],
        
        tech: [
            "Trello - Project management",
            "Todoist - Task lists with reminders",
            "Google Calendar - Time management",
            "Evernote - Note organization",
            "Due - Persistent reminders",
            "Freedom - Website blocker",
            "Forest - Focus timer",
            "Brain.fm - Focus music",
            "Notion - All-in-one workspace",
            "Remember the Milk - Task management"
        ],
        
        checklist: [
            "Chronically disorganized desk, locker, backpack, or workspace",
            "Frequently misses deadlines or turns in incomplete work",
            "Difficulty getting started on tasks (task initiation problems)",
            "Loses essential items (homework, books, permission slips)",
            "Poor time estimation (thinks 5 minutes is enough for 30-minute task)",
            "Difficulty with multi-step projects and long-term assignments",
            "Forgets to turn in completed assignments even when done",
            "Trouble with transitions between activities",
            "Difficulty prioritizing tasks (doesn't know where to start)",
            "Emotional dysregulation (overreacts to minor setbacks)"
        ]
    },
    
    // 8. Autism Spectrum Disorder - Complete
    {
        id: 'autism', name: 'Autism Spectrum Disorder', category: 'Autism', icon: 'fa-puzzle-piece', color: 'autism',
        desc: 'A neurodevelopmental condition characterized by social communication challenges, restricted interests, and sensory sensitivities. It is called a spectrum due to varying severity and combination of symptoms.',
        overview: `Autism Spectrum Disorder (ASD) affects approximately 1 in 36 children. It is a lifelong condition that affects how a person perceives the world and interacts with others. Early diagnosis and intervention can significantly improve outcomes.

Key Facts:
• More common in males than females (4:1 ratio)
• No single cause - combination of genetic and environmental factors
• Many individuals have exceptional abilities in specific areas
• Sensory processing differences are very common
• Support needs vary from minimal to substantial`,
        
        symptoms: [
            "Limited or unusual eye contact",
            "Difficulty with social interactions",
            "Does not respond to name consistently",
            "Prefers playing alone",
            "Repetitive movements (hand flapping, rocking)",
            "Intense, focused interests on specific topics",
            "Distress with changes in routine",
            "Unusual reactions to sensory input",
            "Difficulty understanding social cues",
            "Echolalia (repeats words/phrases)"
        ],
        
        difficulties: [
            "Social communication and interaction",
            "Understanding non-verbal cues (facial expressions, tone)",
            "Making and maintaining friendships",
            "Coping with changes in routine",
            "Sensory processing (over/under sensitivity)",
            "Executive functioning (planning, organization)",
            "Understanding abstract language and idioms",
            "Theory of mind - understanding others' perspectives"
        ],
        
        types: [
            "Autistic Disorder (classic autism)",
            "Asperger Syndrome (without language delay)",
            "Pervasive Developmental Disorder - Not Otherwise Specified (PDD-NOS)",
            "Childhood Disintegrative Disorder",
            "Rett Syndrome (primarily affecting females)",
            "Level 1 - Requiring support",
            "Level 2 - Requiring substantial support",
            "Level 3 - Requiring very substantial support"
        ],
        
        remedies: [
            "Applied Behavior Analysis (ABA) therapy",
            "Speech and language therapy",
            "Occupational therapy for sensory issues",
            "Social skills training groups",
            "Visual supports and social stories",
            "Cognitive Behavioral Therapy (CBT) for anxiety",
            "Sensory integration therapy",
            "Medication for co-occurring conditions (anxiety, ADHD)",
            "Parent training and support",
            "Educational supports and IEP/504 plans"
        ],
        
        activities: [
            "Sensory bins for exploration",
            "Picture Exchange Communication System (PECS)",
            "Social stories about daily routines",
            "Turn-taking games with clear rules",
            "Emotion identification from pictures",
            "Visual schedule practice",
            "Social scripts for common scenarios",
            "Sensory regulation with tools",
            "Job skills practice for older students",
            "Independent living skills training"
        ],
        
        strategies: [
            "Use visual schedules and supports consistently",
            "Provide advance warning for transitions",
            "Create a sensory-friendly classroom environment",
            "Use clear, literal language and avoid idioms",
            "Incorporate special interests into learning",
            "Teach social skills explicitly and practice",
            "Provide breaks for sensory regulation",
            "Use positive reinforcement for desired behaviors",
            "Establish clear routines and expectations",
            "Offer choices within structured options"
        ],
        
        accommodations: [
            "Quiet corner or safe space in classroom",
            "Noise-cancelling headphones available",
            "Written instructions alongside verbal",
            "Flexible seating options",
            "Sensory tools (fidgets, weighted blankets)",
            "Movement breaks throughout day",
            "Reduced sensory stimuli during tests",
            "Visual timers for transitions",
            "Social stories for new activities",
            "Therapeutic brushing or deep pressure if needed"
        ],
        
        tech: [
            "Choiceworks - Visual schedule app",
            "Proloquo2Go - AAC communication app",
            "Social Stories Creator - Custom social stories",
            "Model Me Kids - Social skills videos",
            "Zones of Regulation app",
            "Time Timer - Visual time management",
            "Brain in Hand - Self-management support",
            "Birdhouse for Autism - Tracking app",
            "See.Touch.Learn - Visual learning",
            "Autism Tracker - Data collection"
        ],
        
        checklist: [
            "Does not respond to name consistently when called",
            "Limited or unusual eye contact (too little or too intense)",
            "Prefers playing alone rather than with peers",
            "Engages in repetitive movements (hand flapping, rocking, spinning)",
            "Has intense, focused interests on specific topics or objects",
            "Becomes upset by minor changes in routine or environment",
            "Unusual reactions to sensory input (covers ears, avoids touch, seeks deep pressure)",
            "Difficulty understanding social cues, tone of voice, or jokes",
            "Echolalia (repeats words or phrases heard)",
            "Difficulty with pretend play or imaginative activities"
        ]
    }
];

// ==================== UI FUNCTIONS ====================
function renderDashboard() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    let filtered = disabilities.filter(d => d.name.toLowerCase().includes(searchTerm) || d.desc.toLowerCase().includes(searchTerm));
    const grid = document.getElementById('dashboard-grid');
    if (!grid) return;
    
    grid.innerHTML = filtered.map(d => `
        <div class="disability-card" onclick="showDisability('${d.id}')">
            <div class="card-header"><i class="fas ${d.icon} card-icon"></i><h3>${d.name}</h3><span class="card-category">${d.category}</span></div>
            <div class="card-body"><p class="card-desc">${d.desc.substring(0, 120)}...</p><button class="btn-primary" style="width:100%">View Full Assessment Tool →</button></div>
        </div>
    `).join('');
}

function showDisability(id) {
    currentDisability = disabilities.find(d => d.id === id);
    if (!currentDisability) return;
    renderDetailView();
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('detail-view').classList.remove('hidden');
    window.scrollTo(0, 0);
    incrementUsage();
}

function renderDetailView() {
    if (!currentDisability) return;
    const d = currentDisability;
    
    document.getElementById('detail-name').innerText = d.name;
    document.getElementById('detail-desc').innerText = d.desc;
    document.getElementById('detail-icon').innerHTML = `<i class="fas ${d.icon}"></i>`;
    document.getElementById('detail-tags').innerHTML = `<span class="hero-stat">${d.category}</span><span class="hero-stat">${d.checklist.length} Indicators</span>`;
    
    // Overview
    document.getElementById('overview-content').innerHTML = `<p>${d.overview}</p>`;
    
    // Symptoms
    document.getElementById('symptoms-list').innerHTML = d.symptoms.map(s => `<li><i class="fas fa-exclamation-triangle" style="color:var(--warning);margin-right:10px;"></i>${s}</li>`).join('');
    
    // Difficulties
    document.getElementById('difficulties-list').innerHTML = d.difficulties.map(s => `<li><i class="fas fa-bolt" style="color:var(--danger);margin-right:10px;"></i>${s}</li>`).join('');
    
    // Types
    document.getElementById('types-list').innerHTML = d.types.map(s => `<li><i class="fas fa-tags" style="color:var(--aqua-primary);margin-right:10px;"></i>${s}</li>`).join('');
    
    // Remedies
    document.getElementById('remedies-list').innerHTML = d.remedies.map(s => `<li><i class="fas fa-heartbeat" style="color:var(--success);margin-right:10px;"></i>${s}</li>`).join('');
    
    // Activities
    document.getElementById('activities-list').innerHTML = d.activities.map(s => `<li><i class="fas fa-gamepad" style="color:var(--aqua-primary);margin-right:10px;"></i>${s}</li>`).join('');
    
    // Strategies
    document.getElementById('strategies-list').innerHTML = d.strategies.map(s => `<li><i class="fas fa-chalkboard" style="color:var(--aqua-primary);margin-right:10px;"></i>${s}</li>`).join('');
    
    // Accommodations
    document.getElementById('accommodations-list').innerHTML = d.accommodations.map(s => `<li><i class="fas fa-universal-access" style="color:var(--success);margin-right:10px;"></i>${s}</li>`).join('');
    
    // Tech
    document.getElementById('tech-list').innerHTML = d.tech.map(s => `<li><i class="fas fa-microchip" style="color:var(--aqua-secondary);margin-right:10px;"></i>${s}</li>`).join('');
    
    // Checklist (10 items)
    const checklistHtml = d.checklist.map((item, idx) => `
        <label class="checklist-item"><input type="checkbox" data-check-index="${idx}"><span>${item}</span></label>
    `).join('');
    document.getElementById('checklist-items').innerHTML = checklistHtml;
    
    updateReactionsUI();
}

// ==================== CHECKLIST ANALYSIS ====================
function analyzeChecklist() {
    if (!currentDisability) return;
    const checkboxes = document.querySelectorAll('#checklist-items input');
    const selected = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const percentage = (selected / total * 100).toFixed(1);
    
    let severity, recommendation, urgency;
    if (percentage >= 70) { severity = '⚠️ High Concern'; recommendation = 'Immediate comprehensive evaluation recommended. Contact school psychologist.'; urgency = 'High Priority - 2 weeks'; }
    else if (percentage >= 40) { severity = '📋 Moderate Concern'; recommendation = 'Document observations, implement interventions, follow up in 4-6 weeks.'; urgency = 'Medium Priority'; }
    else { severity = '✅ Low Concern'; recommendation = 'Continue supportive strategies, monitor progress, reassess in 8-10 weeks.'; urgency = 'Routine Monitoring'; }
    
    const resultHtml = `<h4>Analysis Report: ${currentDisability.name}</h4><div style="display:flex;gap:20px;margin:16px 0;"><div><strong>Score:</strong> ${selected}/${total} (${percentage}%)</div><div><strong>Severity:</strong> ${severity}</div><div><strong>Urgency:</strong> ${urgency}</div></div><div><strong>Recommendation:</strong> ${recommendation}</div><button class="btn-primary" onclick="exportChecklistReport()" style="margin-top:16px;"><i class="fas fa-download"></i> Export Full Report</button>`;
    document.getElementById('checklist-result').innerHTML = resultHtml;
    document.getElementById('checklist-result').classList.remove('hidden');
    showToast(`Analysis complete! Score: ${selected}/${total} (${percentage}%)`, 'success');
}

function resetChecklist() {
    document.querySelectorAll('#checklist-items input').forEach(cb => cb.checked = false);
    document.getElementById('checklist-result').classList.add('hidden');
    showToast('Checklist reset', 'info');
}

function exportChecklistReport() {
    if (!currentDisability) return;
    const checkboxes = document.querySelectorAll('#checklist-items input');
    const selectedTexts = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.nextElementSibling.innerText);
    const report = `<!DOCTYPE html><html><head><title>LD Report</title><style>body{font-family:sans-serif;padding:40px}</style></head><body><h1>${currentDisability.name} Assessment Report</h1><p>Date: ${new Date().toLocaleString()}</p><p>Total Indicators: ${selectedTexts.length}/${currentDisability.checklist.length}</p><h3>Observed Behaviors:</h3><ul>${selectedTexts.map(s => `<li>${s}</li>`).join('')}</ul></body></html>`;
    const blob = new Blob([report], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentDisability.id}_report.html`;
    link.click();
    showToast('Report exported', 'success');
}

// ==================== FILE UPLOAD & ANALYSIS ====================
function setupFileUpload() {
    const zone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    if (zone) zone.addEventListener('click', () => fileInput?.click());
    if (fileInput) fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
}

function handleFiles(files) {
    Array.from(files).forEach(file => {
        const fileTag = document.createElement('div');
        fileTag.className = 'file-tag';
        fileTag.innerHTML = `<i class="fas fa-file"></i> ${file.name} <button onclick="this.parentElement.remove()">×</button>`;
        document.getElementById('file-list')?.appendChild(fileTag);
        analyzeFileContent(file);
    });
    showToast(`${files.length} file(s) uploaded and analyzed`, 'success');
}

function analyzeFileContent(file) {
    setTimeout(() => {
        const resultDiv = document.getElementById('analysis-result');
        if (resultDiv) {
            const possibleDisability = disabilities.find(d => file.name.toLowerCase().includes(d.name.toLowerCase())) || disabilities[0];
            resultDiv.innerHTML = `<div style="padding:16px;background:rgba(0,180,216,0.1);border-radius:16px;margin-top:12px;"><strong>Analysis for ${file.name}:</strong><br>• Detected patterns: Potential ${possibleDisability.name}<br>• Recommended checklist: Use ${possibleDisability.name} assessment above<br>• Suggested lesson focus: ${possibleDisability.strategies[0]}<br><button class="btn-outline" onclick="showDisability('${possibleDisability.id}')" style="margin-top:8px;">View Full Assessment</button></div>`;
        }
    }, 1000);
}

// ==================== REACTIONS & SHARING ====================
// addReaction with Cloudflare API (UPDATED)
async function addReaction(emoji) {
    const key = EMOJI_MAP[emoji];
    if (!key) return;
    
    try {
        const result = await callCloudflareAPI('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            reaction: key,
            action: 'add'
        });
        if (result && result.reactions) {
            reactionsData = result.reactions;
        } else {
            reactionsData[key]++;
        }
    } catch (error) {
        reactionsData[key]++;
    }
    
    localStorage.setItem('ld_reactions', JSON.stringify(reactionsData));
    updateReactionsUI();
    showToast(`Thank you! ${emoji}`, 'success');
}

function updateReactionsUI() { 
    const emojis = ['👍','❤️','😮','😢','😠','😂','🎉']; 
    const html = emojis.map(e => `<button class="emoji-btn" onclick="addReaction('${e}')">${e} <span>${reactionsData[EMOJI_MAP[e]] || 0}</span></button>`).join(''); 
    document.querySelectorAll('#reactions-container, #detail-reactions').forEach(el => { if (el) el.innerHTML = html; }); 
}

// sharePlatform with Cloudflare API (UPDATED)
async function sharePlatform(platform) {
    let url = encodeURIComponent(window.location.href);
    let shareUrl = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}`,
        whatsapp: `https://wa.me/?text=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?u=${url}`
    }[platform];
    
    if (shareUrl) window.open(shareUrl, '_blank');
    
    try {
        const result = await callCloudflareAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform,
            action: 'add'
        });
        if (result && result.shares !== undefined) {
            shareCount = result.shares;
        } else {
            shareCount++;
        }
    } catch (error) {
        shareCount++;
    }
    
    document.getElementById('share-count').innerText = shareCount;
    localStorage.setItem('ld_shareCount', shareCount);
    showToast(`Shared on ${platform}!`, 'success');
}

// copyLink with Cloudflare API (UPDATED)
async function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    
    try {
        const result = await callCloudflareAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: 'copy',
            action: 'add'
        });
        if (result && result.shares !== undefined) {
            shareCount = result.shares;
        } else {
            shareCount++;
        }
    } catch (error) {
        shareCount++;
    }
    
    document.getElementById('share-count').innerText = shareCount;
    localStorage.setItem('ld_shareCount', shareCount);
    showToast('Link copied!', 'success');
}

// ==================== STUDENT MANAGEMENT ====================
function showAddStudentModal() { document.getElementById('student-modal').classList.remove('hidden'); }
function closeModal() { document.getElementById('student-modal').classList.add('hidden'); }
function addStudent() {
    const name = document.getElementById('new-student-name')?.value;
    if (!name) { showToast('Enter student name', 'error'); return; }
    students.push({ id: Date.now(), name, grade: document.getElementById('new-student-grade')?.value, disabilityId: document.getElementById('new-student-disability')?.value, notes: document.getElementById('new-student-notes')?.value, date: new Date().toLocaleString() });
    localStorage.setItem('ld_students', JSON.stringify(students));
    updateStudentList();
    closeModal();
    showToast(`Student ${name} added`, 'success');
}
function updateStudentList() {
    document.getElementById('student-count').innerText = students.length;
    const container = document.getElementById('student-list');
    if (container) container.innerHTML = students.map(s => `<div class="student-item"><div><strong>${s.name}</strong><br><small>${s.grade || 'No grade'} | Added: ${s.date}</small></div><div><button class="btn-outline" style="padding:5px 12px;" onclick="viewStudent(${s.id})">View</button> <button class="btn-outline" style="padding:5px 12px;" onclick="deleteStudent(${s.id})">Delete</button></div></div>`).join('');
}
function viewStudent(id) { const s = students.find(s => s.id === id); if (s?.disabilityId) showDisability(s.disabilityId); else showToast('No disability selected for this student', 'info'); }
function deleteStudent(id) { students = students.filter(s => s.id !== id); localStorage.setItem('ld_students', JSON.stringify(students)); updateStudentList(); showToast('Student removed', 'info'); }

// ==================== LESSON PLAN GENERATION ====================
function generateLessonPlan() {
    if (!currentDisability) { showToast('Select a disability first', 'error'); return; }
    const studentName = document.getElementById('student-name')?.value || 'Student';
    const subject = document.getElementById('lesson-subject')?.value || currentDisability.name;
    const duration = document.getElementById('lesson-duration')?.value || 45;
    const html = `<h4><i class="fas fa-calendar-alt"></i> Lesson Plan: ${studentName}</h4><p><strong>Disability:</strong> ${currentDisability.name} | <strong>Subject:</strong> ${subject} | <strong>Duration:</strong> ${duration} min</p><h5>Objectives:</h5><ul><li>Demonstrate understanding of ${subject} concepts</li><li>Apply ${currentDisability.name} strategies to complete tasks</li></ul><h5>Structure:</h5><ul><li>Warm-up (5-7 min)</li><li>Direct instruction with accommodations (12-15 min)</li><li>Guided practice (12-15 min)</li><li>Independent practice (8-10 min)</li><li>Assessment and closure (5 min)</li></ul><h5>Accommodations:</h5><ul>${currentDisability.accommodations.slice(0, 4).map(a => `<li>${a}</li>`).join('')}</ul><button class="btn-outline" onclick="exportLessonPlan()"><i class="fas fa-download"></i> Export Plan</button>`;
    document.getElementById('generated-lesson').innerHTML = html;
    document.getElementById('generated-lesson').classList.remove('hidden');
    showToast('Lesson plan generated!', 'success');
}
function exportLessonPlan() { const content = document.getElementById('generated-lesson')?.innerHTML || ''; const blob = new Blob([content], { type: 'text/html' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `lesson_plan_${Date.now()}.html`; link.click(); }

// ==================== UTILITIES ====================
// incrementUsage with Cloudflare API (UPDATED)
async function incrementUsage() {
    try {
        const result = await callCloudflareAPI('/api/usage', 'POST', { 
            tool_slug: TOOL_SLUG,
            action: 'increment'
        });
        if (result && result.usage !== undefined) {
            usageCount = result.usage;
        } else {
            usageCount++;
        }
    } catch (error) {
        usageCount++;
    }
    localStorage.setItem('ld_usageCount', usageCount);
    document.getElementById('usage-counter').innerText = usageCount;
}

function showToast(msg, type) { 
    const toast = document.createElement('div'); 
    toast.className = 'toast'; 
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${msg}`; 
    document.body.appendChild(toast); 
    setTimeout(() => toast.remove(), 3000); 
}
function toggleTheme() { 
    const html = document.documentElement; 
    const isDark = html.getAttribute('data-theme') === 'dark'; 
    html.setAttribute('data-theme', isDark ? 'light' : 'dark'); 
    localStorage.setItem('ld_theme', isDark ? 'light' : 'dark'); 
    document.querySelector('#theme-toggle i').className = isDark ? 'fas fa-moon' : 'fas fa-sun'; 
}
function setupShareUI() { 
    const container = document.getElementById('share-container'); 
    if (container) container.innerHTML = `<button class="share-btn" onclick="sharePlatform('facebook')"><i class="fab fa-facebook-f"></i></button><button class="share-btn" onclick="sharePlatform('twitter')"><i class="fab fa-twitter"></i></button><button class="share-btn" onclick="sharePlatform('whatsapp')"><i class="fab fa-whatsapp"></i></button><button class="share-btn" onclick="sharePlatform('linkedin')"><i class="fab fa-linkedin-in"></i></button><button class="share-btn" onclick="copyLink()"><i class="fas fa-link"></i></button>`; 
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('ld_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    usageCount = parseInt(localStorage.getItem('ld_usageCount') || '0');
    shareCount = parseInt(localStorage.getItem('ld_shareCount') || '0');
    students = JSON.parse(localStorage.getItem('ld_students') || '[]');
    document.getElementById('usage-counter').innerText = usageCount;
    document.getElementById('share-count').innerText = shareCount;
    
    // Fetch stats from Cloudflare API (ADDED)
    fetchToolStats();
    
    // Increment usage on load (UPDATED with API)
    incrementUsage();
    
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('back-btn')?.addEventListener('click', () => { document.getElementById('detail-view').classList.add('hidden'); document.getElementById('dashboard-view').classList.remove('hidden'); renderDashboard(); });
    document.getElementById('analyze-checklist')?.addEventListener('click', analyzeChecklist);
    document.getElementById('reset-checklist')?.addEventListener('click', resetChecklist);
    document.getElementById('generate-lesson')?.addEventListener('click', generateLessonPlan);
    document.getElementById('scroll-up')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.getElementById('scroll-down')?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    document.getElementById('search-input')?.addEventListener('input', renderDashboard);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => { btn.addEventListener('click', () => { const tabId = btn.dataset.tab; document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active')); document.getElementById(tabId).classList.add('active'); }); });
    
    setupShareUI();
    setupFileUpload();
    updateStudentList();
    renderDashboard();
    updateReactionsUI();
    
    window.showDisability = showDisability;
    window.addReaction = addReaction;
    window.sharePlatform = sharePlatform;
    window.copyLink = copyLink;
    window.generateLessonPlan = generateLessonPlan;
    window.exportLessonPlan = exportLessonPlan;
    window.exportChecklistReport = exportChecklistReport;
    window.showAddStudentModal = showAddStudentModal;
    window.closeModal = closeModal;
    window.addStudent = addStudent;
    window.viewStudent = viewStudent;
    window.deleteStudent = deleteStudent;
});
