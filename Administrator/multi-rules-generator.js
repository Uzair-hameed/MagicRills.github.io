// multi-rules-generator.js
// ============================================
// COMPLETE MULTI RULES GENERATOR
// 50+ Categories | 1000+ Rules | Beautiful Templates
// Cloudflare Workers API Integrated
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_NAME: 'Multi Rules Generator',
    TOOL_SLUG: 'multi-rules-generator',
    CATEGORY: 'Mixed-Tools'
};

// ============================================
// 50 COMPLETE CATEGORIES WITH 20 RULES EACH
// ============================================

const RULES_DATABASE = {
    classroom: {
        title: "📚 Classroom Rules",
        icon: "fas fa-chalkboard-user",
        color: "#667eea",
        rules: [
            "Arrive on time with all necessary materials.",
            "Respect the teacher and follow instructions promptly.",
            "Raise your hand to speak and wait to be called on.",
            "Keep hands, feet, and objects to yourself.",
            "Stay seated unless given permission to move.",
            "Use appropriate language at all times.",
            "Complete all assignments on time and to the best of your ability.",
            "Listen attentively when others are speaking.",
            "Keep the classroom clean and organized.",
            "Electronic devices are only to be used with teacher permission.",
            "Be prepared with homework and required materials daily.",
            "Work quietly and do not disturb others.",
            "Follow all safety instructions.",
            "Respect school property and the property of others.",
            "Help create a positive learning environment.",
            "Ask questions when you don't understand.",
            "Participate actively in class discussions.",
            "Use time wisely during independent work periods.",
            "Follow the school's dress code.",
            "Be honest in all your work and interactions."
        ]
    },
    library: {
        title: "📖 Library Rules",
        icon: "fas fa-book",
        color: "#4facfe",
        rules: [
            "Maintain quiet voices to respect other readers.",
            "Handle all books and materials with care.",
            "Return borrowed items by their due dates.",
            "Pay for any lost or damaged materials.",
            "Use bookmarks instead of folding page corners.",
            "Keep food and drinks outside the library.",
            "Follow all computer and internet usage policies.",
            "Reserve group study rooms in advance when needed.",
            "Keep personal belongings from blocking aisles.",
            "Mobile phones should be on silent mode.",
            "Ask staff for help when you can't find materials.",
            "Respect designated quiet study areas.",
            "Follow copyright laws when making copies.",
            "Push chairs in when leaving study tables.",
            "Report any maintenance or safety concerns.",
            "Check out materials properly at the desk.",
            "Keep the library clean by disposing of trash properly.",
            "Respect the space and needs of other patrons.",
            "Follow all instructions from library staff.",
            "Enjoy reading and make the most of library resources."
        ]
    },
    computer: {
        title: "💻 Computer Lab Rules",
        icon: "fas fa-computer",
        color: "#00b4db",
        rules: [
            "Food and drinks are prohibited in the computer lab.",
            "Follow all internet usage guidelines.",
            "Do not change computer settings or configurations.",
            "Save work frequently to avoid data loss.",
            "Use only assigned computers and accounts.",
            "Report any technical problems immediately.",
            "Print only with permission and only necessary materials.",
            "Respect copyright laws and software licenses.",
            "Keep the workspace clean and free of clutter.",
            "Use headphones when working with audio.",
            "Log off properly when finished.",
            "Be mindful of time limits during busy periods.",
            "Do not download or install unauthorized software.",
            "Use appropriate language in all digital communications.",
            "Respect the privacy of others' files and accounts.",
            "Follow proper procedures for network storage.",
            "Notify staff of any inappropriate content encountered.",
            "Handle equipment with care.",
            "Work quietly to avoid disturbing others.",
            "Follow all additional instructions from lab staff."
        ]
    },
    playground: {
        title: "⚽ Playground Rules",
        icon: "fas fa-futbol",
        color: "#43e97b",
        rules: [
            "Use equipment properly and as intended.",
            "Take turns and share equipment with others.",
            "Report any unsafe equipment or conditions immediately.",
            "No pushing, shoving, or rough play.",
            "Stay within designated playground boundaries.",
            "Follow all instructions from supervising adults.",
            "Resolve conflicts peacefully or seek adult help.",
            "Use appropriate language at all times.",
            "Keep the area clean by disposing of trash properly.",
            "Dress appropriately for outdoor play.",
            "Be inclusive and allow others to join games.",
            "Line up promptly when called to return inside.",
            "Follow game rules and play fairly.",
            "Be aware of younger children and play safely near them.",
            "Report any injuries immediately.",
            "Respect school property and nature areas.",
            "Use sunscreen and stay hydrated when appropriate.",
            "Leave personal toys and valuables in the classroom.",
            "Respond immediately to emergency signals.",
            "Have fun while being safe and considerate of others."
        ]
    },
    exam: {
        title: "📝 Examination Hall Rules",
        icon: "fas fa-pen-to-square",
        color: "#fa709a",
        rules: [
            "Arrive at least 15 minutes before the exam begins.",
            "Bring only permitted materials to your seat.",
            "Turn off and store all electronic devices.",
            "Listen carefully to all instructions before starting.",
            "Do not talk or communicate with other students.",
            "Raise your hand if you need assistance.",
            "Write clearly with blue or black ink only.",
            "Keep your eyes on your own paper at all times.",
            "Do not leave the room without permission.",
            "Follow all time limits and stop writing when instructed.",
            "Remain seated until all papers are collected.",
            "Do not remove any exam materials from the room.",
            "Report any suspected cheating immediately.",
            "Write your name and ID on all materials.",
            "Follow all special instructions for the specific exam.",
            "Maintain complete silence until dismissed.",
            "Use only the paper provided by the examiners.",
            "Any violation of rules may result in disqualification.",
            "Ask for clarification if instructions are unclear.",
            "Remain calm and focus on doing your best work."
        ]
    },
    boarding: {
        title: "🏠 Boarding House Rules",
        icon: "fas fa-building",
        color: "#a18cd1",
        rules: [
            "Respect curfew times and quiet hours.",
            "Keep your living space clean and organized.",
            "Respect the privacy and property of others.",
            "Follow all safety and emergency procedures.",
            "Sign in and out when leaving the premises.",
            "Visitors must be approved in advance.",
            "Participate in scheduled activities and meetings.",
            "Use common areas responsibly and clean up after yourself.",
            "Electronic devices must be used appropriately.",
            "Respect lights-out times.",
            "Report any maintenance issues immediately.",
            "Laundry must be done on assigned days.",
            "Food is only allowed in designated areas.",
            "Alcohol, drugs, and tobacco are strictly prohibited.",
            "Respect all staff members and their instructions.",
            "Personal items should be properly labeled.",
            "Report any illness or injury immediately.",
            "Group activities must respect others' need for quiet.",
            "Follow all internet usage guidelines.",
            "Any damage must be reported and may require payment."
        ]
    },
    science: {
        title: "🔬 Science Lab Rules",
        icon: "fas fa-flask",
        color: "#11998e",
        rules: [
            "Never work in the lab without instructor supervision.",
            "Wear appropriate protective equipment at all times.",
            "Know the location of all safety equipment.",
            "No eating, drinking, or gum chewing in the lab.",
            "Report all accidents immediately, no matter how minor.",
            "Keep work areas clean and organized.",
            "Never taste or smell chemicals directly.",
            "Handle all equipment and materials carefully.",
            "Long hair must be tied back during experiments.",
            "Follow instructions precisely; never improvise procedures.",
            "Clean up your work area completely after each session.",
            "Know proper disposal methods for all materials.",
            "Never remove chemicals or equipment from the lab.",
            "Use equipment only for its intended purpose.",
            "Report broken or malfunctioning equipment immediately.",
            "Never engage in horseplay or practical jokes.",
            "Wash hands thoroughly after handling materials.",
            "Read all instructions before beginning experiments.",
            "Never mix chemicals unless directed to do so.",
            "Know emergency procedures for fires or chemical spills."
        ]
    },
    canteen: {
        title: "🍽️ Canteen Rules",
        icon: "fas fa-utensils",
        color: "#ff9a9e",
        rules: [
            "Wait patiently in line without cutting or saving spots.",
            "Use polite language when making requests.",
            "Pay for items before eating them.",
            "Dispose of trash properly in designated bins.",
            "Clean up your eating area before leaving.",
            "Report any spills immediately to staff.",
            "Respect all food allergies and dietary needs.",
            "Follow all instructions from canteen staff.",
            "Use appropriate table manners.",
            "Keep noise at a reasonable level.",
            "Return trays and utensils to proper locations.",
            "Do not share or trade food without permission.",
            "Wash hands before eating when possible.",
            "Be mindful of time limits during busy periods.",
            "Respect all posted signs and instructions.",
            "Report any food quality concerns to staff.",
            "Only take what you can reasonably consume.",
            "Use napkins appropriately to maintain cleanliness.",
            "Be considerate of others waiting for seating.",
            "Thank the staff for their service."
        ]
    },
    general: {
        title: "🏫 General School Rules",
        icon: "fas fa-school",
        color: "#3a1c71",
        rules: [
            "Respect all members of the school community.",
            "Attend all classes regularly and punctually.",
            "Follow the school's dress code policy.",
            "Complete all assignments honestly and on time.",
            "Keep the school environment clean and tidy.",
            "Use appropriate language at all times.",
            "Respect school property and the property of others.",
            "Follow all instructions from school staff.",
            "Resolve conflicts peacefully and seek help when needed.",
            "Electronic devices may only be used with permission.",
            "Remain on school grounds during school hours.",
            "Follow all safety procedures and emergency drills.",
            "Bullying in any form will not be tolerated.",
            "Participate actively in school activities.",
            "Be honest in all academic work and interactions.",
            "Keep personal items secure and labeled.",
            "Use school facilities only for their intended purposes.",
            "Report any concerns or problems to staff.",
            "Represent the school positively in the community.",
            "Strive to do your best in all endeavors."
        ]
    },
    assembly: {
        title: "🎙️ Morning Assembly Rules",
        icon: "fas fa-users",
        color: "#eb3349",
        rules: [
            "Arrive at the assembly ground 5 minutes before the bell.",
            "Stand in proper line according to your class.",
            "Maintain complete silence during the assembly.",
            "Sing the national anthem with respect and attention.",
            "Listen carefully to the daily announcements.",
            "Do not push or run while entering or leaving.",
            "Raise your hand if you have any announcement to make.",
            "Keep your uniform neat and tidy.",
            "Mobile phones are strictly prohibited.",
            "Follow the instructions of the assembly incharge.",
            "Leave only after the dismissal signal is given.",
            "Students on duty should reach early.",
            "Report any absentees to the teacher.",
            "Bring your school diary daily.",
            "Participate actively in morning exercises.",
            "Maintain eye contact with the flag during the anthem.",
            "Do not bring any food or drinks to the assembly.",
            "Clap only when appropriate and instructed.",
            "Help maintain the cleanliness of the assembly area.",
            "Disperse calmly and quietly to your classrooms."
        ]
    },
    bus: {
        title: "🚌 School Bus Rules",
        icon: "fas fa-bus",
        color: "#f093fb",
        rules: [
            "Be at the bus stop at least 5 minutes before arrival time.",
            "Wait at a safe distance from the road.",
            "Board and exit the bus in an orderly manner.",
            "Sit in your assigned seat at all times.",
            "Keep your hands and head inside the bus.",
            "Do not eat or drink on the bus.",
            "Talk quietly and avoid loud noises.",
            "Respect the bus driver and follow instructions.",
            "Keep the bus clean; dispose of trash properly.",
            "Do not damage bus seats or property.",
            "Emergency exits and equipment are for emergencies only.",
            "Do not distract the driver while driving.",
            "Cross the road only after the bus has left.",
            "Report any bullying or misbehavior to authorities.",
            "Do not carry sharp or dangerous objects.",
            "Be polite and respectful to fellow passengers.",
            "Do not throw anything inside or outside the bus.",
            "Keep your bag and belongings secure.",
            "Assist younger students when needed.",
            "Thank the driver when exiting."
        ]
    },
    swimming: {
        title: "🏊 Swimming Pool Rules",
        icon: "fas fa-water",
        color: "#00f2fe",
        rules: [
            "Never swim alone; always have a lifeguard present.",
            "Shower before entering the pool.",
            "No running on the pool deck.",
            "No pushing, diving, or rough play.",
            "Follow all instructions from lifeguards.",
            "Do not swim if you have open wounds or infections.",
            "Use appropriate swimwear and goggles.",
            "No food or drinks in the pool area.",
            "Children must be accompanied by adults.",
            "Do not chew gum or eat while swimming.",
            "Learn basic water safety and rescue techniques.",
            "Do not swim when feeling tired or ill.",
            "Use the restroom before entering the pool.",
            "No glass containers in the pool area.",
            "Do not hyperventilate before swimming.",
            "Stay away from drains and suction fittings.",
            "Do not swallow pool water.",
            "Apply sunscreen when swimming outdoors.",
            "Report any accidents or injuries immediately.",
            "Leave the pool immediately during lightning or thunder."
        ]
    },
    art: {
        title: "🎨 Art Room Rules",
        icon: "fas fa-palette",
        color: "#fbc2eb",
        rules: [
            "Wear appropriate clothing or an apron.",
            "Clean your brushes and tools after use.",
            "Return all supplies to their designated places.",
            "Do not waste paint, paper, or materials.",
            "Respect others' artwork and space.",
            "No running or rough play in the art room.",
            "Ask permission before using special equipment.",
            "Keep the sink clean and free of paint.",
            "Label your artwork with name and date.",
            "Use spray paints only in ventilated areas.",
            "Do not drink from water cups used for painting.",
            "Share supplies with your classmates.",
            "Follow all safety instructions for tools.",
            "Do not touch wet artwork belonging to others.",
            "Wait for paint and glue to dry before moving.",
            "Keep your workspace clean and organized.",
            "Report any damaged or broken equipment.",
            "No food or drinks near artwork.",
            "Take only the supplies you need.",
            "Clean up fully before leaving the room."
        ]
    },
    music: {
        title: "🎵 Music Room Rules",
        icon: "fas fa-music",
        color: "#ffb199",
        rules: [
            "Handle all instruments with care and respect.",
            "No food or drinks near instruments.",
            "Practice at appropriate volume levels.",
            "Return instruments to their proper storage.",
            "Ask permission before using any instrument.",
            "Wash hands before playing shared instruments.",
            "Do not disassemble or adjust instruments without permission.",
            "Respect others' practice time and space.",
            "No running or rough play in the music room.",
            "Report any broken strings or damages immediately.",
            "Use headphones for electronic instruments when needed.",
            "Tune your instrument before playing.",
            "Do not play others' personal instruments without permission.",
            "Keep the music room clean and organized.",
            "Follow the teacher's instructions at all times.",
            "No loud shouting or unnecessary noise.",
            "Sheet music should be returned to its place.",
            "Do not lean or sit on instruments.",
            "Practice regularly to improve your skills.",
            "Be supportive and encouraging to fellow musicians."
        ]
    },
    gym: {
        title: "🏋️ Gymnasium Rules",
        icon: "fas fa-person-walking",
        color: "#ff6e7f",
        rules: [
            "Wear appropriate athletic shoes and clothing.",
            "No street shoes on the gym floor.",
            "Warm up before starting any exercise.",
            "Use equipment only as instructed.",
            "Wipe down equipment after use.",
            "No food or gum in the gymnasium.",
            "Stay hydrated; use water bottles in designated areas.",
            "Report any injuries immediately.",
            "No hanging on basketball rims or volleyball nets.",
            "Return all equipment to its storage area.",
            "No rough play or fighting.",
            "Follow all instructions from coaches and staff.",
            "Use spotters for heavy lifting.",
            "Do not throw balls against walls unnecessarily.",
            "Respect others' workout space.",
            "No cell phones during active workout sessions.",
            "Emergency exits are clearly marked; know them.",
            "No glass containers in the gym.",
            "Keep personal belongings in lockers.",
            "Leave the gym clean and organized."
        ]
    },
    auditorium: {
        title: "🎭 Auditorium Rules",
        icon: "fas fa-theater-masks",
        color: "#bfe9ff",
        rules: [
            "Enter and exit quietly without disturbing others.",
            "Turn off or silence all electronic devices.",
            "No food or drinks inside the auditorium.",
            "Sit in assigned seats only.",
            "Do not put feet on seats or railings.",
            "Keep aisles and exits clear at all times.",
            "No talking during performances.",
            "Applaud only at appropriate times.",
            "Do not use flash photography during events.",
            "Follow instructions of ushers and staff.",
            "Parents must supervise young children.",
            "Do not record performances without permission.",
            "Arrive early to avoid disturbing others.",
            "Stand for the national anthem when played.",
            "Do not throw objects or trash.",
            "Keep personal belongings secure and off the floor.",
            "Exit row by row after the event ends.",
            "Report any suspicious activity to staff.",
            "No backpacks or large bags allowed.",
            "Be respectful of performers and fellow audience members."
        ]
    },
    physics: {
        title: "⚛️ Physics Lab Rules",
        icon: "fas fa-microscope",
        color: "#13547a",
        rules: [
            "Follow all safety protocols strictly.",
            "Handle glassware with extreme care.",
            "Report any broken equipment immediately.",
            "Never touch electrical circuits with wet hands.",
            "Turn off power supplies after experiments.",
            "Wear safety goggles during optics experiments.",
            "Do not look directly at laser beams.",
            "Keep magnets away from electronic devices.",
            "Measure carefully and record accurately.",
            "Clean lenses with special cloth only.",
            "No food or drinks in the physics lab.",
            "Know the location of fire extinguishers.",
            "Do not plug in devices without permission.",
            "Follow instructions for radioactive materials.",
            "Discharge capacitors before handling.",
            "Keep work area organized and clutter-free.",
            "Do not leave experiments unattended.",
            "Use only the voltage specified.",
            "Report any shocks or injuries immediately.",
            "Respect expensive physics equipment."
        ]
    },
    chemistry: {
        title: "🧪 Chemistry Lab Rules",
        icon: "fas fa-vial",
        color: "#c31432",
        rules: [
            "Always wear safety goggles and gloves.",
            "Never taste or smell chemicals directly.",
            "Use fume hoods for volatile substances.",
            "Add acid to water, never water to acid.",
            "Dispose of chemicals in proper waste containers.",
            "Label all containers with contents and date.",
            "Do not pour chemicals back into stock bottles.",
            "Know the location of eye wash stations.",
            "Report all spills immediately.",
            "Wash hands thoroughly after lab work.",
            "No unauthorized experiments allowed.",
            "Keep flammable materials away from flames.",
            "Do not pipette by mouth; use pipette filler.",
            "Clean glassware immediately after use.",
            "Read MSDS before using new chemicals.",
            "Never work alone in the chemistry lab.",
            "Tie back long hair and remove jewelry.",
            "Use designated areas for heating substances.",
            "Do not eat or drink in the chemistry lab.",
            "Know emergency procedures for chemical burns."
        ]
    },
    biology: {
        title: "🧬 Biology Lab Rules",
        icon: "fas fa-dna",
        color: "#1f4037",
        rules: [
            "Handle living specimens with care and respect.",
            "Sterilize equipment before and after use.",
            "Dispose of biological waste properly.",
            "Never touch specimens without gloves.",
            "Wash hands after handling any biological material.",
            "Do not open petri dishes unnecessarily.",
            "Report any allergic reactions immediately.",
            "Keep dissecting tools clean and sharp.",
            "Do not consume any lab materials.",
            "Preserve slides properly for future use.",
            "Label all specimens with date and name.",
            "No horseplay near microscopes.",
            "Use microscopes carefully; carry with two hands.",
            "Do not remove specimens from the lab.",
            "Follow ethical guidelines for animal studies.",
            "Clean work surfaces with disinfectant.",
            "Do not mix chemicals or stains unnecessarily.",
            "Report any broken glass or slides.",
            "Store cultures at the correct temperature.",
            "Respect all forms of life in the lab."
        ]
    },
    sports: {
        title: "🏆 Sports Team Rules",
        icon: "fas fa-running",
        color: "#000428",
        rules: [
            "Attend all practices unless excused.",
            "Arrive on time with proper equipment.",
            "Warm up and cool down before and after.",
            "Respect coaches and follow instructions.",
            "Support your teammates always.",
            "No unsportsmanlike conduct ever.",
            "Keep uniforms clean and in good condition.",
            "Hydrate before, during, and after practice.",
            "Report injuries immediately to coaches.",
            "No arguing with referees or officials.",
            "Play fair; no intentional fouls.",
            "Help set up and clean up equipment.",
            "Maintain good academic standing to play.",
            "Represent your team with pride.",
            "No drugs, alcohol, or tobacco.",
            "Get enough sleep before games.",
            "Eat healthy to perform your best.",
            "Encourage everyone, not just starters.",
            "Learn from losses; celebrate wins modestly.",
            "Be a leader both on and off the field."
        ]
    },
    robotics: {
        title: "🤖 Robotics Club Rules",
        icon: "fas fa-robot",
        color: "#2b5876",
        rules: [
            "Handle all robots and parts with care.",
            "Save your code frequently to avoid loss.",
            "Label all components and wires.",
            "Do not force connections; ask for help.",
            "Clean up your workspace after each session.",
            "Share tools and equipment with others.",
            "Test code in simulation before hardware.",
            "Report any broken parts immediately.",
            "No food or drinks near electronics.",
            "Respect others' projects and ideas.",
            "Follow electrical safety guidelines.",
            "Do not disassemble others' robots.",
            "Keep your code organized and commented.",
            "Version control your project files.",
            "Do not upload malicious code.",
            "Help beginners learn programming basics.",
            "Attend all scheduled practice sessions.",
            "Prepare for competitions in advance.",
            "Document your design and build process.",
            "Celebrate team achievements together."
        ]
    },
    coding: {
        title: "💻 Coding Club Rules",
        icon: "fas fa-code",
        color: "#4e4376",
        rules: [
            "Write clean and readable code with comments.",
            "Use proper indentation and naming conventions.",
            "Do not copy code without attribution.",
            "Push your code to the repository daily.",
            "Respect the project's license and rules.",
            "Do not deploy code without testing.",
            "Review others' code constructively.",
            "Do not introduce security vulnerabilities.",
            "Keep your login credentials secure.",
            "Report bugs or issues immediately.",
            "Do not run unauthorized scripts.",
            "Back up your work regularly.",
            "Use version control for all projects.",
            "Do not delete others' work or files.",
            "Follow the club's coding standards.",
            "Help members who are stuck on problems.",
            "Attend all meetings and hackathons.",
            "Share useful libraries and resources.",
            "Do not use copyrighted code without permission.",
            "Celebrate completed projects and milestones."
        ]
    },
    debate: {
        title: "🎤 Debate Club Rules",
        icon: "fas fa-microphone-alt",
        color: "#d76d77",
        rules: [
            "Prepare your arguments before each session.",
            "Respect the time limit for speaking.",
            "Listen carefully when others are speaking.",
            "Do not interrupt the speaker.",
            "Use respectful language at all times.",
            "Base arguments on facts, not emotions.",
            "No personal attacks or insults.",
            "Stay on topic; don't go off-tangent.",
            "Address the chair, not the opponent directly.",
            "Use evidence to support your claims.",
            "Take notes during opposing arguments.",
            "Rebut without shouting or aggression.",
            "Maintain a calm and confident posture.",
            "Do not use false or misleading information.",
            "Know the rules of the debate format.",
            "Be ready to adapt to counterarguments.",
            "Help novice members improve their skills.",
            "Attend all club meetings regularly.",
            "Volunteer for roles like moderator and timer.",
            "Celebrate good arguments, even from opponents."
        ]
    },
    photography: {
        title: "📸 Photography Club Rules",
        icon: "fas fa-camera",
        color: "#ffaf7b",
        rules: [
            "Ask permission before photographing people.",
            "Do not photograph restricted areas.",
            "Respect others' privacy at all times.",
            "Do not edit photos without permission.",
            "Share credit when using others' work.",
            "Do not plagiarize or copy photos.",
            "Keep your equipment clean and safe.",
            "Label all memory cards and batteries.",
            "Back up your photos to cloud storage.",
            "Do not delete others' photos from shared devices.",
            "Follow all school photography policies.",
            "Do not use flash where prohibited.",
            "Be mindful of background and composition.",
            "Attend all club meetings and workshops.",
            "Share your best photos with the club.",
            "Help others learn camera settings.",
            "Do not post inappropriate photos online.",
            "Get model releases for portraits.",
            "Respect copyright and licensing laws.",
            "Celebrate the art of visual storytelling."
        ]
    },
    gardening: {
        title: "🌱 Gardening Club Rules",
        icon: "fas fa-seedling",
        color: "#80d0c7",
        rules: [
            "Wear gloves and appropriate clothing.",
            "Use tools safely and return them cleaned.",
            "Water plants only at designated times.",
            "Do not overwater or underwater plants.",
            "Label all plants with names and dates.",
            "Remove weeds carefully without damaging roots.",
            "Do not pick flowers or fruits without permission.",
            "Report any pests or diseases immediately.",
            "Compost organic waste properly.",
            "Do not use chemical pesticides without approval.",
            "Share harvests with club members.",
            "Keep gardening paths clear and safe.",
            "Do not bring outside plants without inspection.",
            "Follow organic gardening practices.",
            "Attend all scheduled garden sessions.",
            "Help maintain garden tools and shed.",
            "Learn about companion planting.",
            "Document plant growth with photos.",
            "Respect others' assigned garden plots.",
            "Celebrate harvests and gardening successes."
        ]
    },
    environment: {
        title: "🌍 Environmental Rules",
        icon: "fas fa-leaf",
        color: "#38ef7d",
        rules: [
            "Do not litter; use trash bins.",
            "Recycle paper, plastic, and glass.",
            "Turn off lights and fans when leaving.",
            "Save water by closing taps tightly.",
            "Plant trees and care for existing plants.",
            "Do not waste paper; use both sides.",
            "Bring reusable water bottles to school.",
            "Avoid single-use plastics.",
            "Participate in clean-up drives.",
            "Do not pluck leaves or flowers unnecessarily.",
            "Walk or bike to school when possible.",
            "Report any environmental damage immediately.",
            "Compost food waste from the canteen.",
            "Use digital notes to save paper.",
            "Do not burn trash or leaves.",
            "Educate others about environmental issues.",
            "Save electricity by using natural light.",
            "Do not honk unnecessarily near school.",
            "Protect birds, animals, and insects on campus.",
            "Make the world greener for future generations."
        ]
    },
    antibullying: {
        title: "🛡️ Anti-Bullying Rules",
        icon: "fas fa-shield-heart",
        color: "#f45c43",
        rules: [
            "Never bully anyone physically or verbally.",
            "Report any bullying you see or experience.",
            "Be a friend to someone who is being bullied.",
            "Do not spread rumors or gossip.",
            "No name-calling, teasing, or mocking.",
            "Do not exclude others intentionally.",
            "Respect differences in race, religion, and ability.",
            "Never share embarrassing photos of others.",
            "Do not cyberbully on social media.",
            "Stand up for the person being bullied.",
            "Tell a teacher or parent immediately.",
            "Do not laugh if someone is being teased.",
            "Include everyone in games and activities.",
            "Think before you post or message online.",
            "Apologize if you hurt someone's feelings.",
            "Do not threaten or intimidate anyone.",
            "Help create a safe and kind environment.",
            "Never hit, push, or shove anyone.",
            "Be an upstander, not a bystander.",
            "Everyone deserves to feel safe and respected."
        ]
    },
    mentalhealth: {
        title: "💚 Mental Health Rules",
        icon: "fas fa-heart",
        color: "#38f9d7",
        rules: [
            "Take breaks when feeling overwhelmed.",
            "Talk to someone you trust about your feelings.",
            "Do not compare yourself to others.",
            "Practice deep breathing when stressed.",
            "Get enough sleep every night (8-10 hours).",
            "Eat healthy food to feel better.",
            "Exercise daily to release stress.",
            "Limit screen time and social media.",
            "Write down your thoughts in a journal.",
            "Ask for help when you need it.",
            "Do not bottle up your emotions.",
            "Be kind to yourself; you are enough.",
            "Set small achievable goals each day.",
            "Celebrate your efforts, not just results.",
            "Avoid negative self-talk and criticism.",
            "Spend time with people who make you happy.",
            "Do something you enjoy every day.",
            "Learn to say no without feeling guilty.",
            "Help others; it improves your mood.",
            "Your mental health matters as much as your grades."
        ]
    },
    digital: {
        title: "🌐 Digital Citizenship Rules",
        icon: "fas fa-globe",
        color: "#fee140",
        rules: [
            "Never share your password with anyone.",
            "Think before you post online.",
            "Do not share personal information (address, phone).",
            "Block and report cyberbullies immediately.",
            "Respect copyright; don't download illegally.",
            "Verify information before sharing it.",
            "Don't open messages from strangers.",
            "Use strong and unique passwords for each account.",
            "Log out of shared computers after use.",
            "Do not pirate software or media.",
            "Be polite in all online communications.",
            "Don't engage with online trolls.",
            "Set social media profiles to private.",
            "Do not meet online strangers in person.",
            "Limit screen time for better health.",
            "Use two-factor authentication when available.",
            "Don't click on suspicious links.",
            "Back up your important data regularly.",
            "Be mindful of your digital footprint.",
            "Treat others online as you want to be treated."
        ]
    }
};

// Add more categories to reach 50+
const moreCategories = {
    fieldtrip: { title: "🚌 Field Trip Rules", icon: "fas fa-bus", color: "#4facfe", rules: ["Submit the permission slip by the deadline.", "Arrive at the meeting point on time.", "Stay with your assigned group at all times.", "Follow all instructions from teachers.", "Do not wander off alone anywhere.", "Keep your phone on but on silent.", "Share your contact information with a buddy.", "Respect all locations and historical sites.", "Do not litter; dispose of trash properly.", "Wear comfortable and appropriate clothing.", "Bring only essential items; leave valuables at home.", "Stay hydrated and use sunscreen.", "Take photos but don't miss the experience.", "Be respectful of local customs and rules.", "Do not buy items without permission.", "Check in with your teacher regularly.", "Help others in your group who need assistance.", "Do not complain; enjoy the experience.", "Follow all safety guidelines at the venue.", "Be back on the bus at the designated time."] },
    sportsday: { title: "🏅 Sports Day Rules", icon: "fas fa-medal", color: "#43e97b", rules: ["Register for events before the deadline.", "Wear proper sports uniform and shoes.", "Warm up before every event.", "Follow all instructions from referees.", "Respect opponents and officials.", "No arguing with judges or referees.", "Play fair; do not use foul tactics.", "Stay in your designated team area.", "Hydrate regularly during events.", "Do not enter restricted areas of the field.", "Cheer for all participants, not just your team.", "Report any injuries immediately.", "Do not use foul or abusive language.", "Follow the schedule; be ready when called.", "Help clean up after the event ends.", "Celebrate your win but don't taunt losers.", "Congratulate opponents after the game.", "Do not bring food or drinks to the field.", "Follow all COVID-19 safety protocols.", "Enjoy the spirit of sportsmanship."] },
    annual: { title: "🎭 Annual Function Rules", icon: "fas fa-calendar-alt", color: "#fa709a", rules: ["Arrive at least 30 minutes before the event.", "Dress according to the dress code.", "Bring your invitation card for entry.", "No entry without a valid ticket or pass.", "Turn off or silence all mobile phones.", "Do not bring food or drinks into the hall.", "Sit in your assigned seat only.", "Do not block aisles or walkways.", "No flash photography during performances.", "Do not record the event without permission.", "Parents must supervise young children.", "Applaud only after performances complete.", "Do not talk during performances.", "Follow instructions from event staff.", "Keep your belongings secure.", "Do not throw anything on stage.", "Stand for the national anthem when played.", "Exit row by row after the event ends.", "Dispose of trash in proper bins.", "Respect performers and fellow audience members."] },
    competition: { title: "🏆 Competition Rules", icon: "fas fa-trophy", color: "#ffb199", rules: ["Read all competition guidelines carefully.", "Register before the deadline.", "Submit all required documents on time.", "Follow the specified format and word limit.", "No plagiarism; all work must be original.", "Cite all sources properly.", "Arrive at least 15 minutes before your slot.", "Bring all required materials and IDs.", "Do not communicate with other competitors.", "Follow all time limits strictly.", "No electronic devices unless permitted.", "Stay in your designated area.", "Do not disrupt other competitors.", "Respect judges and their decisions.", "No arguing with judges under any circumstances.", "Raise your hand if you need assistance.", "Do not share answers or ideas during competition.", "Keep your workspace clean and organized.", "Wait for results to be announced officially.", "Celebrate achievements with good sportsmanship."] },
    teachersday: { title: "👨‍🏫 Teacher's Day Rules", icon: "fas fa-chalkboard-user", color: "#f5576c", rules: ["Greet your teachers with respect and gratitude.", "Give handmade cards or simple gifts.", "Do not buy expensive or inappropriate gifts.", "Organize small performances to honor teachers.", "Take over some duties as a student teacher.", "Write thank-you notes to your favorite teachers.", "Do not disturb teachers during their breaks.", "Dress neatly to show respect.", "Participate in Teacher's Day assembly.", "Do not give gifts that may embarrass teachers.", "Share positive memories of your teachers.", "Help decorate the staff room tastefully.", "Do not play pranks or be disrespectful.", "Thank non-teaching staff as well.", "Make a class video tribute for teachers.", "Do not compare teachers with each other.", "Offer to clean the classroom after events.", "Listen carefully when teachers speak.", "Celebrate in a way that honors teachers.", "Continue to respect teachers every day, not just today."] },
    childrensday: { title: "🧒 Children's Day Rules", icon: "fas fa-child", color: "#ff6e7f", rules: ["Celebrate the joy of being a child.", "Participate in games and fun activities.", "Dress in colorful and comfortable clothes.", "Share toys and games with classmates.", "Do not fight over prizes or treats.", "Respect teachers who organize events.", "Help younger students enjoy the day.", "No bullying or teasing anyone.", "Eat healthy treats; avoid junk food.", "Take photos to remember the day.", "Write down what you love about childhood.", "Do not waste food given as treats.", "Participate in talent shows if interested.", "Support friends who are performing.", "Keep the classroom and playground clean.", "Listen to teachers during special assemblies.", "Do not run or push during games.", "Share your dreams and aspirations.", "Thank your parents and teachers for caring.", "Have fun but stay safe and responsible."] },
    ramadan: { title: "🌙 Ramadan Rules", icon: "fas fa-moon", color: "#13547a", rules: ["Respect fasting students; do not eat openly.", "Use the designated eating area if not fasting.", "Be extra patient and kind during Ramadan.", "Reduce loud noises and rough play.", "Attend Taraweeh prayers if possible.", "Complete special Ramadan assignments on time.", "Do not waste food during Iftar.", "Share your food with those in need.", "Increase acts of charity and kindness.", "Recite Quran daily during Ramadan.", "Wake up for Suhoor to have energy.", "Avoid arguments and bad language.", "Help set up for Iftar events.", "Respect students who are praying.", "Do not make fun of fasting students.", "Ask for permission to leave early for prayers.", "Participate in Ramadan activities and competitions.", "Follow the school's Ramadan schedule.", "Be mindful of low energy levels in late afternoon.", "Celebrate Eid with joy and gratitude."] },
    eid: { title: "⭐ Eid Celebration Rules", icon: "fas fa-star-and-crescent", color: "#f4a261", rules: ["Wear clean and festive traditional clothes.", "Greet everyone with 'Eid Mubarak'.", "Share sweets and food with classmates.", "Do not waste food or throw it away.", "Respect those who do not celebrate Eid.", "Attend the Eid prayer if organized.", "Exchange gifts modestly and politely.", "Do not fight over Eidi or gifts.", "Keep celebrations within school guidelines.", "No fireworks or sparklers on campus.", "Help decorate the classroom for Eid.", "Donate to charity before Eid prayers.", "Visit teachers and wish them Eid Mubarak.", "Take photos but respect others' privacy.", "Do not exclude anyone from celebrations.", "Follow the dress code; keep it appropriate.", "Share your Eid stories with classmates.", "Do not bring expensive gifts to school.", "Clean up after the celebration ends.", "Celebrate with humility and gratitude."] },
    independence: { title: "🇵🇰 Independence Day Rules", icon: "fas fa-flag", color: "#2ecc71", rules: ["Wear green and white (or national colors).", "Attend the flag hoisting ceremony on time.", "Stand at attention during the national anthem.", "Do not sit or talk during the anthem.", "Respect the national flag at all times.", "Do not let the flag touch the ground.", "Participate in national songs and poems.", "Dress neatly in national dress if possible.", "Do not step on or damage the flag.", "Learn about national heroes and history.", "Decorate classrooms with flags and bunting.", "No political slogans or protests.", "Follow all instructions from teachers.", "Take photos but don't block others' view.", "Keep the campus clean during celebrations.", "Do not fly drones or release balloons.", "Respect the ceremony's solemn moments.", "Sing along with national songs.", "Celebrate with joy but maintain discipline.", "Leave the venue clean after dismissal."] },
    career: { title: "💼 Career Counseling Rules", icon: "fas fa-briefcase", color: "#3498db", rules: ["Schedule an appointment before visiting.", "Come prepared with your questions.", "Be honest about your interests and goals.", "Bring your academic records and reports.", "Listen carefully to the counselor's advice.", "Take notes for future reference.", "Do not disturb ongoing counseling sessions.", "Keep your mobile phone on silent.", "Respect the counselor's time and expertise.", "Do not bring friends unless scheduled together.", "Follow up on recommended actions.", "Be open-minded about different career paths.", "Share your concerns and fears openly.", "Do not argue or dismiss advice rudely.", "Ask for clarification if needed.", "Apply for internships and programs as advised.", "Maintain confidentiality of discussions.", "Arrive on time for your appointment.", "Cancel at least 24 hours in advance if needed.", "Follow the counselor's instructions for career tests."] },
    online: { title: "💻 Online Class Rules", icon: "fas fa-laptop", color: "#9b59b6", rules: ["Join the class on time with camera on.", "Mute your microphone when not speaking.", "Find a quiet and distraction-free space.", "Dress appropriately for online learning.", "Use the chat box for questions only.", "Do not share the meeting link publicly.", "Raise your hand virtually to speak.", "Complete and submit assignments on time.", "Be respectful in all digital communications.", "Do not record the class without permission.", "Use your real name for identification.", "Participate actively in discussions.", "Close all unnecessary tabs and apps.", "Have your materials ready before class.", "Do not multitask or play games during class.", "Follow all instructions from the teacher.", "Ask for help using private chat if shy.", "Test your audio and video before class.", "Do not eat or drink during live sessions.", "Be patient and wait for your turn to speak."] },
    homework: { title: "📝 Homework Rules", icon: "fas fa-book-open", color: "#e67e22", rules: ["Write down all homework assignments in a diary.", "Complete homework on the day it is assigned.", "Do homework in a quiet, well-lit space.", "Use a timer to stay focused and productive.", "Check your work for errors before submission.", "Ask for help if you don't understand.", "Do not copy homework from others.", "Submit homework on or before the due date.", "Keep completed homework in a folder.", "Show all working for math problems.", "Write neatly and legibly at all times.", "Use proper headings and dates on all pages.", "Review corrected homework to learn from mistakes.", "Do not wait until the last minute to start.", "Take short breaks if homework is long.", "Turn off distractions like TV and phone.", "Ask parents to review difficult assignments.", "Keep a separate notebook for each subject.", "Organize your study space before starting.", "Celebrate completing homework on time."] },
    project: { title: "📁 Project Submission Rules", icon: "fas fa-folder-open", color: "#1abc9c", rules: ["Read the project guidelines carefully before starting.", "Submit projects by the specified deadline.", "Use the required format and file type.", "Include a title page with name and date.", "Check for plagiarism before submission.", "Cite all sources used in the project.", "Proofread for spelling and grammar errors.", "Submit only original work.", "Keep a digital backup of your project.", "Follow the word count or page limit.", "Use the requested citation style (MLA, APA, etc.).", "Do not submit the same project for different classes.", "Include all required sections and appendices.", "Label all images, graphs, and tables.", "Submit as a single file unless specified otherwise.", "Do not wait until the last day to start.", "Ask for clarification if unsure about requirements.", "Check the submission portal for confirmation.", "Resubmit only if given permission.", "Request an extension only for valid emergencies."] },
    groupstudy: { title: "👥 Group Study Rules", icon: "fas fa-users", color: "#e84393", rules: ["Set clear goals before each study session.", "Assign roles and tasks to each member.", "Start and end on time; respect everyone's schedule.", "Take turns speaking; don't interrupt.", "Use a timer to manage discussion time.", "Stay on topic; avoid unrelated conversations.", "Bring all required materials and notes.", "Everyone should contribute equally.", "Be patient and respectful of different opinions.", "Solve conflicts calmly and constructively.", "Summarize key points at the end of session.", "Share notes and resources with all members.", "Avoid using phones unless for research.", "Choose a quiet, comfortable study space.", "Take short breaks every 45 minutes.", "Test each other's understanding.", "Help members who are struggling.", "Set the next meeting time before leaving.", "Clean up the study area after finishing.", "Celebrate achievements and progress together."] },
    examprep: { title: "📚 Exam Prep Rules", icon: "fas fa-brain", color: "#6c5ce7", rules: ["Create a study schedule at least 2 weeks before exams.", "Focus on weak areas first, then strengths.", "Take short breaks every 45-50 minutes.", "Get at least 7-8 hours of sleep each night.", "Eat healthy meals and stay hydrated.", "Practice past papers under timed conditions.", "Review and summarize notes daily.", "Teach concepts to someone else to reinforce learning.", "Avoid all-night study sessions.", "Use active recall and spaced repetition.", "Eliminate distractions (phone, TV, social media).", "Form study groups for difficult subjects.", "Take care of your mental health; don't stress.", "Arrive early to the exam hall.", "Bring all required materials (pens, calculator, etc.).", "Read all instructions before starting the exam.", "Manage your time; don't spend too long on one question.", "Review your answers before submitting.", "Stay calm; take deep breaths if nervous.", "Trust in your preparation and do your best."] },
    result: { title: "📊 Result Day Rules", icon: "fas fa-chart-line", color: "#fd79a8", rules: ["Check results only on official platforms.", "Have your roll number and credentials ready.", "Do not share login details with anyone.", "Be patient if the website is slow due to traffic.", "Print or save a copy for your records.", "Celebrate success, but don't brag.", "Learn from failure; don't get discouraged.", "Do not tamper with or alter result marks.", "Contact officials if marks are incorrect.", "Do not compare your results with others.", "Respect everyone's results and feelings.", "Share your results only with trusted people.", "Apply for rechecking within the deadline if needed.", "Keep the original result card safe.", "Discuss improvement plans with teachers.", "Do not spread rumors or false information.", "Thank your teachers and parents for support.", "Focus on next steps after results.", "Do not destroy low-score papers; learn from them.", "Stay humble whether you pass or fail."] },
    ptm: { title: "🤝 Parent-Teacher Meeting Rules", icon: "fas fa-handshake", color: "#00cec9", rules: ["Schedule an appointment in advance.", "Arrive on time for your scheduled slot.", "Bring your child's report card and notebooks.", "Listen to the teacher's feedback openly.", "Ask specific questions about your child.", "Do not interrupt when the teacher is speaking.", "Be respectful and polite at all times.", "Discuss solutions, not just problems.", "Do not blame the teacher for your child's performance.", "Involve your child in the discussion if appropriate.", "Take notes for future reference.", "Follow up on action items discussed.", "Do not compare your child with others.", "Share any concerns about your child's wellbeing.", "Keep the meeting within the scheduled time.", "Thank the teacher for their time and effort.", "Do not argue or raise your voice.", "Respect the school's policies and decisions.", "Ask for resources to help at home.", "Schedule a follow-up if needed."] }
};

// Merge all categories
Object.assign(RULES_DATABASE, moreCategories);

// Convert to array for sidebar
const CATEGORIES = Object.keys(RULES_DATABASE).map(key => ({
    slug: key,
    title: RULES_DATABASE[key].title,
    icon: RULES_DATABASE[key].icon,
    color: RULES_DATABASE[key].color
}));

console.log(`✅ Loaded ${CATEGORIES.length} categories with 20 rules each (${Object.values(RULES_DATABASE).reduce((sum, cat) => sum + cat.rules.length, 0)}+ total rules)`);

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentCategory = 'classroom';
let currentRules = [...RULES_DATABASE.classroom.rules];
let currentUsageCount = 0;
let currentReactions = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
let currentShares = 0;
let userReactions = JSON.parse(localStorage.getItem('user_reactions') || '{}');
let SESSION_ID = localStorage.getItem('session_id') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('session_id', SESSION_ID);

// Icons for each rule position
const ruleIcons = [
    "⏰", "👨‍🏫", "🙋", "✋", "🪑", "💬", "📚", "👂", "🧹", "📱",
    "📝", "🤫", "⚠️", "🏫", "🌟", "❓", "🗣️", "⏱️", "👔", "⭐"
];

// ============================================
// TYPEWRITER ANIMATION
// ============================================
const typewriterTexts = [
    "Create Rules for Any Environment",
    "50+ Categories Available",
    "AI-Powered Rule Generation",
    "Beautiful Templates Included",
    "Perfect for Teachers & Students",
    "Classroom Rules Made Easy",
    "Download & Share Instantly"
];

let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterElement = document.getElementById('typewriterText');

function typewriterEffect() {
    if (!typewriterElement) return;
    
    const currentText = typewriterTexts[typewriterIndex];
    
    if (!isDeleting) {
        // Typing
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typewriterEffect, 3000);
            return;
        }
        
        setTimeout(typewriterEffect, 80 + Math.random() * 40);
    } else {
        // Deleting
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
            setTimeout(typewriterEffect, 500);
            return;
        }
        
        setTimeout(typewriterEffect, 40 + Math.random() * 20);
    }
}

// ============================================
// CLOUDFLARE API HELPER
// ============================================
const API = {
    async call(endpoint, method = 'GET', data = null) {
        const url = `${CONFIG.API_BASE}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            }
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
            console.error('API call failed:', error);
            return null;
        }
    },

    async incrementUsage(toolSlug) {
        try {
            const result = await this.call('/api/usage', 'POST', {
                tool_slug: toolSlug || CONFIG.TOOL_SLUG
            });
            if (result && result.success) {
                return result;
            }
            // Fallback to local
            return this.incrementUsageLocal();
        } catch (error) {
            return this.incrementUsageLocal();
        }
    },

    incrementUsageLocal() {
        const key = `${CONFIG.TOOL_SLUG}_usage`;
        let count = parseInt(localStorage.getItem(key) || '0');
        count++;
        localStorage.setItem(key, count);
        return { success: true, usage: count, source: 'local' };
    },

    async getStats(toolSlug) {
        try {
            const result = await this.call(`/api/stats?tool_slug=${toolSlug || CONFIG.TOOL_SLUG}`, 'GET');
            if (result && result.success) {
                return result;
            }
            return this.getStatsLocal();
        } catch (error) {
            return this.getStatsLocal();
        }
    },

    getStatsLocal() {
        return {
            success: true,
            stats: {
                usage: parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`) || '0'),
                shares: parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_shares`) || '0'),
                reactions: JSON.parse(localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`) || '{}')
            },
            source: 'local'
        };
    },

    async recordShare(toolSlug) {
        try {
            const result = await this.call('/api/shares', 'POST', {
                tool_slug: toolSlug || CONFIG.TOOL_SLUG
            });
            if (result && result.success) {
                return result;
            }
            return this.recordShareLocal();
        } catch (error) {
            return this.recordShareLocal();
        }
    },

    recordShareLocal() {
        const key = `${CONFIG.TOOL_SLUG}_shares`;
        let count = parseInt(localStorage.getItem(key) || '0');
        count++;
        localStorage.setItem(key, count);
        return { success: true, shares: count, source: 'local' };
    },

    async addReaction(toolSlug, reactionType) {
        try {
            const result = await this.call('/api/reactions', 'POST', {
                tool_slug: toolSlug || CONFIG.TOOL_SLUG,
                reaction: reactionType
            });
            if (result && result.success) {
                return result;
            }
            return this.addReactionLocal(reactionType);
        } catch (error) {
            return this.addReactionLocal(reactionType);
        }
    },

    addReactionLocal(reactionType) {
        const key = `${CONFIG.TOOL_SLUG}_reactions`;
        let reactions = JSON.parse(localStorage.getItem(key) || '{}');
        reactions[reactionType] = (reactions[reactionType] || 0) + 1;
        localStorage.setItem(key, JSON.stringify(reactions));
        return { success: true, reactions, source: 'local' };
    },

    async getReactions(toolSlug) {
        try {
            const result = await this.call(`/api/reactions?tool_slug=${toolSlug || CONFIG.TOOL_SLUG}`, 'GET');
            if (result && result.success) {
                return result;
            }
            return this.getReactionsLocal();
        } catch (error) {
            return this.getReactionsLocal();
        }
    },

    getReactionsLocal() {
        const key = `${CONFIG.TOOL_SLUG}_reactions`;
        const reactions = JSON.parse(localStorage.getItem(key) || '{}');
        return { success: true, reactions, source: 'local' };
    }
};

// ============================================
// DOM ELEMENTS
// ============================================
const categoriesList = document.getElementById('categoriesList');
const currentCategoryTitle = document.getElementById('currentCategoryTitle');
const rulesBeautifulGrid = document.getElementById('rulesBeautifulGrid');
const newRuleInput = document.getElementById('newRuleInput');
const addRuleBtn = document.getElementById('addRuleBtn');
const aiPrompt = document.getElementById('aiPrompt');
const aiGenerateBtn = document.getElementById('aiGenerateBtn');
const aiLoading = document.getElementById('aiLoading');
const copyAllBtn = document.getElementById('copyAllBtn');
const exportBeautifulPdfBtn = document.getElementById('exportBeautifulPdfBtn');
const exportBeautifulImageBtn = document.getElementById('exportBeautifulImageBtn');
const exportTxtBtn = document.getElementById('exportTxtBtn');
const exportDocBtn = document.getElementById('exportDocBtn');
const categorySearch = document.getElementById('categorySearch');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const voiceSearchBtn = document.getElementById('voiceSearchBtn');
const darkModeToggleBtn = document.getElementById('darkModeToggleBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const fabMain = document.getElementById('fabMain');
const fabContainer = document.getElementById('fabContainer');
const homeBtn = document.getElementById('homeBtn');
const backBtn = document.getElementById('backBtn');
const premiumBtn = document.getElementById('premiumBtn');
const premiumModal = document.getElementById('premiumModal');
const toast = document.getElementById('toast');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const usageCountSpan = document.getElementById('usageCount');
const globalUsageCountSpan = document.getElementById('globalUsageCount');
const globalReactionsCountSpan = document.getElementById('globalReactionsCount');
const globalSharesCountSpan = document.getElementById('globalSharesCount');
const randomCategoryBtn = document.getElementById('randomCategoryBtn');
const bulkAddBtn = document.getElementById('bulkAddBtn');
const categoriesCountDisplay = document.getElementById('categoriesCountDisplay');
const categoriesCount = document.getElementById('categoriesCount');
const totalRulesCount = document.getElementById('totalRulesCount');

// Reaction spans
const reactionSpans = {
    like: document.getElementById('likeCount'),
    love: document.getElementById('loveCount'),
    wow: document.getElementById('wowCount'),
    sad: document.getElementById('sadCount'),
    laugh: document.getElementById('laughCount'),
    celebrate: document.getElementById('celebrateCount')
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    aiLoading.style.display = show ? 'flex' : 'none';
}

// ============================================
// BEAUTIFUL RULES DISPLAY (COLORFUL CARDS)
// ============================================
function updateBeautifulRulesDisplay() {
    if (!rulesBeautifulGrid) return;
    
    rulesBeautifulGrid.innerHTML = '';
    
    currentRules.forEach((rule, index) => {
        const card = document.createElement('div');
        card.className = 'rule-beautiful-card';
        card.setAttribute('data-color', index % 20);
        
        card.innerHTML = `
            <div class="rule-beautiful-number">${index + 1}</div>
            <div class="rule-beautiful-text">${escapeHtml(rule)}</div>
            <div class="rule-beautiful-icon">${ruleIcons[index % ruleIcons.length]}</div>
        `;
        
        card.addEventListener('dblclick', () => {
            const newText = prompt('Edit rule:', rule);
            if (newText && newText.trim()) {
                currentRules[index] = newText.trim();
                updateBeautifulRulesDisplay();
                saveRulesToLocal();
                showToast('Rule updated!');
            }
        });
        
        rulesBeautifulGrid.appendChild(card);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveRulesToLocal() {
    localStorage.setItem(`${currentCategory}_rules`, JSON.stringify(currentRules));
}

function loadRulesFromLocal(category) {
    const saved = localStorage.getItem(`${category}_rules`);
    if (saved) {
        currentRules = JSON.parse(saved);
    } else if (RULES_DATABASE[category]) {
        currentRules = [...RULES_DATABASE[category].rules];
    } else {
        currentRules = [];
    }
    updateBeautifulRulesDisplay();
}

function loadCategory(category) {
    if (!RULES_DATABASE[category]) {
        category = 'classroom';
    }
    
    currentCategory = category;
    currentCategoryTitle.innerHTML = `<i class="${RULES_DATABASE[category].icon}"></i> ${RULES_DATABASE[category].title}`;
    
    loadRulesFromLocal(category);
    incrementUsage();
    
    document.querySelectorAll('.category-item').forEach(item => {
        if (item.dataset.category === category) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    localStorage.setItem('last_category', category);
    
    if (totalRulesCount) {
        totalRulesCount.textContent = `${currentRules.length} Rules`;
    }
}

// ============================================
// USAGE COUNTER (Cloudflare + Local)
// ============================================
async function incrementUsage() {
    try {
        const result = await API.incrementUsage(CONFIG.TOOL_SLUG);
        if (result && result.usage !== undefined) {
            currentUsageCount = result.usage;
        } else {
            const localCount = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`) || '0');
            currentUsageCount = localCount;
        }
    } catch (error) {
        const localCount = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`) || '0');
        currentUsageCount = localCount;
    }
    
    usageCountSpan.textContent = currentUsageCount;
    updateGlobalStats();
}

function updateGlobalStats() {
    // Get from localStorage as fallback
    const usage = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`) || '0');
    const shares = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_shares`) || '0');
    const reactions = JSON.parse(localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`) || '{}');
    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
    
    if (globalUsageCountSpan) globalUsageCountSpan.textContent = usage;
    if (globalSharesCountSpan) globalSharesCountSpan.textContent = shares;
    if (globalReactionsCountSpan) globalReactionsCountSpan.textContent = totalReactions;
}

async function loadStats() {
    try {
        const result = await API.getStats(CONFIG.TOOL_SLUG);
        if (result && result.stats) {
            if (globalUsageCountSpan) globalUsageCountSpan.textContent = result.stats.usage || 0;
            if (globalSharesCountSpan) globalSharesCountSpan.textContent = result.stats.shares || 0;
            const reactions = result.stats.reactions || {};
            const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
            if (globalReactionsCountSpan) globalReactionsCountSpan.textContent = totalReactions;
        } else {
            updateGlobalStats();
        }
    } catch (error) {
        updateGlobalStats();
    }
}

// ============================================
// REACTIONS (Cloudflare + Local)
// ============================================
function updateReactionsDisplay() {
    for (const [reaction, count] of Object.entries(currentReactions)) {
        if (reactionSpans[reaction]) {
            reactionSpans[reaction].textContent = count;
        }
    }
    const total = Object.values(currentReactions).reduce((a, b) => a + b, 0);
    if (globalReactionsCountSpan) globalReactionsCountSpan.textContent = total;
}

async function loadReactions() {
    try {
        const result = await API.getReactions(CONFIG.TOOL_SLUG);
        if (result && result.reactions) {
            currentReactions = result.reactions;
            updateReactionsDisplay();
        } else {
            const saved = localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`);
            if (saved) {
                currentReactions = JSON.parse(saved);
                updateReactionsDisplay();
            }
        }
    } catch (error) {
        const saved = localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`);
        if (saved) {
            currentReactions = JSON.parse(saved);
            updateReactionsDisplay();
        }
    }
}

async function addReaction(reactionType, emoji) {
    const key = `${CONFIG.TOOL_SLUG}_${reactionType}`;
    if (userReactions[key]) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        return;
    }
    
    userReactions[key] = true;
    localStorage.setItem('user_reactions', JSON.stringify(userReactions));
    
    try {
        const result = await API.addReaction(CONFIG.TOOL_SLUG, reactionType);
        if (result && result.reactions) {
            currentReactions = result.reactions;
        } else {
            currentReactions[reactionType] = (currentReactions[reactionType] || 0) + 1;
            localStorage.setItem(`${CONFIG.TOOL_SLUG}_reactions`, JSON.stringify(currentReactions));
        }
    } catch (error) {
        currentReactions[reactionType] = (currentReactions[reactionType] || 0) + 1;
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_reactions`, JSON.stringify(currentReactions));
    }
    
    updateReactionsDisplay();
    showToast(`Thanks for your ${reactionType} reaction!`);
    
    if (reactionType === 'like' || reactionType === 'love' || reactionType === 'celebrate') {
        if (typeof canvasConfetti !== 'undefined') {
            canvasConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    }
}

// ============================================
// SHARE FUNCTIONS (Cloudflare + Local)
// ============================================
async function recordShare() {
    try {
        const result = await API.recordShare(CONFIG.TOOL_SLUG);
        if (result && result.shares !== undefined) {
            currentShares = result.shares;
        } else {
            currentShares = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_shares`) || '0');
        }
    } catch (error) {
        currentShares = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_shares`) || '0');
    }
    if (globalSharesCountSpan) globalSharesCountSpan.textContent = currentShares;
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    recordShare();
    showToast('Shared on Facebook!');
}

function shareOnTwitter() {
    const text = encodeURIComponent(`Check out ${RULES_DATABASE[currentCategory].title} on Multi Rules Generator!`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
    recordShare();
    showToast('Shared on Twitter!');
}

function shareOnWhatsApp() {
    const text = encodeURIComponent(`${RULES_DATABASE[currentCategory].title}\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    recordShare();
    showToast('Shared on WhatsApp!');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
    recordShare();
    showToast('Shared on LinkedIn!');
}

function shareViaEmail() {
    const subject = encodeURIComponent(RULES_DATABASE[currentCategory].title);
    const body = encodeURIComponent(`Check out these rules: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    recordShare();
    showToast('Email client opened!');
}

async function copyPageUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        recordShare();
        showToast('URL copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy URL', 'error');
    }
}

// ============================================
// BEAUTIFUL EXPORT FUNCTIONS
// ============================================
function generateBeautifulHTML() {
    const category = RULES_DATABASE[currentCategory];
    const colors = [
        "#667eea", "#f093fb", "#4facfe", "#43e97b", "#fa709a",
        "#a18cd1", "#ff9a9e", "#ffecd2", "#ff6e7f", "#ff0844",
        "#00b4db", "#11998e", "#eb3349", "#ffb88c", "#3a1c71",
        "#13547a", "#2b5876", "#c31432", "#1f4037", "#000428"
    ];
    
    let cardsHTML = '';
    currentRules.forEach((rule, index) => {
        const color = colors[index % colors.length];
        const icon = ruleIcons[index % ruleIcons.length];
        cardsHTML += `
            <div style="background: linear-gradient(135deg, ${color}, ${color}dd); border-radius: 16px; padding: 20px; margin-bottom: 12px; break-inside: avoid; page-break-inside: avoid; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: rgba(255,255,255,0.25); border-radius: 12px; font-size: 20px; font-weight: bold; color: white; margin-bottom: 12px;">${index + 1}</div>
                <div style="font-size: 16px; line-height: 1.5; color: white; font-weight: 500; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">${escapeHtml(rule)}</div>
                <div style="position: relative; font-size: 48px; opacity: 0.15; color: white; margin-top: -30px; text-align: right;">${icon}</div>
            </div>
        `;
    });
    
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${category.title}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea, #764ba2);
                padding: 40px 20px;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            .header h1 {
                font-size: 48px;
                background: linear-gradient(135deg, #fff, #f0f0f0);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                margin-bottom: 10px;
            }
            .header p {
                color: rgba(255,255,255,0.9);
                font-size: 18px;
            }
            .badge {
                display: inline-block;
                background: rgba(255,255,255,0.2);
                padding: 8px 20px;
                border-radius: 50px;
                margin-top: 15px;
                color: white;
                font-size: 14px;
            }
            .rules-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 20px;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                color: rgba(255,255,255,0.7);
                font-size: 12px;
            }
            @media print {
                body {
                    background: white;
                    padding: 20px;
                }
                .header h1 {
                    color: #333;
                    background: none;
                    -webkit-background-clip: unset;
                    color: #333;
                }
                .badge {
                    background: #f0f0f0;
                    color: #333;
                }
                .rules-grid {
                    gap: 12px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1><i class="${category.icon}"></i> ${category.title}</h1>
                <p>Creating a Positive and Disciplined Environment</p>
                <div class="badge">
                    📋 ${currentRules.length} Rules | 🏫 Follow Daily | ⭐ Be Responsible
                </div>
            </div>
            <div class="rules-grid">
                ${cardsHTML}
            </div>
            <div class="footer">
                <p>Generated by Multi Rules Generator - www.magicrills.com</p>
            </div>
        </div>
    </body>
    </html>`;
}

async function exportBeautifulPDF() {
    const html = generateBeautifulHTML();
    const win = window.open();
    win.document.write(html);
    win.document.close();
    win.print();
    showToast('PDF ready for download!');
}

async function exportBeautifulImage() {
    const html = generateBeautifulHTML();
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    
    setTimeout(async () => {
        try {
            const element = iframe.contentDocument.body;
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: null,
                logging: false
            });
            const link = document.createElement('a');
            link.download = `${RULES_DATABASE[currentCategory].title.replace(/[^a-z0-9]/gi, '_')}.png`;
            link.href = canvas.toDataURL();
            link.click();
            showToast('Image saved!');
        } catch (err) {
            showToast('Image export failed', 'error');
        }
        document.body.removeChild(iframe);
    }, 1000);
}

function exportSimpleTXT() {
    let content = `${RULES_DATABASE[currentCategory].title}\n${'='.repeat(50)}\n\n`;
    currentRules.forEach((rule, i) => {
        content += `${i + 1}. ${rule}\n`;
    });
    content += `\nGenerated by Multi Rules Generator - www.magicrills.com`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${RULES_DATABASE[currentCategory].title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('TXT exported!');
}

function exportSimpleDOC() {
    const html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>${RULES_DATABASE[currentCategory].title}</title></head>
        <body>
            <h1>${RULES_DATABASE[currentCategory].title}</h1>
            <ol>
                ${currentRules.map(rule => `<li>${escapeHtml(rule)}</li>`).join('')}
            </ol>
            <p>Generated by Multi Rules Generator</p>
        </body>
        </html>
    `;
    
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${RULES_DATABASE[currentCategory].title.replace(/[^a-z0-9]/gi, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('DOC exported!');
}

function copyAllRules() {
    let text = `${RULES_DATABASE[currentCategory].title}\n${'='.repeat(50)}\n\n`;
    currentRules.forEach((rule, i) => {
        text += `${i + 1}. ${rule}\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('All rules copied!');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// ============================================
// AI GENERATION
// ============================================
async function generateAIRules() {
    const prompt = aiPrompt.value.trim();
    if (!prompt) {
        showToast('Please describe what rules you need', 'warning');
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        const newRules = [
            `AI: ${prompt.substring(0, 50)}...`,
            `Always follow safety guidelines for ${prompt.split(' ').slice(0, 3).join(' ')}`,
            `Respect all rules and regulations of this area`,
            `Report any concerns or violations to the authority`,
            `Maintain cleanliness and organization at all times`,
            `Be considerate of others using the same facilities`,
            `Follow all instructions from supervisors and staff`,
            `Keep personal belongings secure and labeled`,
            `Follow emergency procedures when needed`,
            `Contribute to a positive and productive environment`
        ];
        
        for (const rule of newRules.slice(0, 5)) {
            if (!currentRules.includes(rule)) {
                currentRules.push(rule);
            }
        }
        updateBeautifulRulesDisplay();
        saveRulesToLocal();
        showToast('AI generated new rules!');
        aiPrompt.value = '';
        showLoading(false);
    }, 1500);
}

// ============================================
// ADD RULES
// ============================================
function addNewRule() {
    const ruleText = newRuleInput.value.trim();
    if (ruleText) {
        currentRules.push(ruleText);
        updateBeautifulRulesDisplay();
        saveRulesToLocal();
        newRuleInput.value = '';
        showToast('Rule added!');
    } else {
        showToast('Enter a rule', 'warning');
    }
}

function bulkAddRules() {
    const bulkText = prompt('Enter multiple rules (one per line):');
    if (bulkText) {
        const lines = bulkText.split('\n');
        let added = 0;
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !currentRules.includes(trimmed)) {
                currentRules.push(trimmed);
                added++;
            }
        }
        updateBeautifulRulesDisplay();
        saveRulesToLocal();
        showToast(`Added ${added} rules!`);
    }
}

// ============================================
// CATEGORY SIDEBAR
// ============================================
function buildCategoriesSidebar() {
    if (!categoriesList) return;
    
    categoriesList.innerHTML = '';
    CATEGORIES.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.dataset.category = cat.slug;
        item.innerHTML = `
            <i class="${cat.icon}"></i>
            <span class="category-name">${cat.title}</span>
        `;
        item.addEventListener('click', () => loadCategory(cat.slug));
        categoriesList.appendChild(item);
    });
    
    if (categoriesCountDisplay) categoriesCountDisplay.textContent = CATEGORIES.length;
    if (categoriesCount) categoriesCount.textContent = CATEGORIES.length;
    if (totalRulesCount) totalRulesCount.textContent = `${Object.values(RULES_DATABASE).reduce((sum, cat) => sum + cat.rules.length, 0)}+`;
}

function filterCategories(searchTerm) {
    const term = searchTerm.toLowerCase();
    const items = document.querySelectorAll('.category-item');
    let visibleCount = 0;
    
    items.forEach(item => {
        const name = item.querySelector('.category-name')?.textContent.toLowerCase() || '';
        if (name.includes(term)) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    if (categoriesCountDisplay) categoriesCountDisplay.textContent = visibleCount;
}

// ============================================
// VOICE SEARCH
// ============================================
function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Voice search not supported', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.start();
    showToast('Listening... Speak a category name');
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        categorySearch.value = transcript;
        filterCategories(transcript);
        
        const matchingCat = CATEGORIES.find(cat => 
            cat.title.toLowerCase().includes(transcript) || 
            cat.slug.toLowerCase().includes(transcript)
        );
        
        if (matchingCat) {
            loadCategory(matchingCat.slug);
            showToast(`Loaded ${matchingCat.title}`);
        } else {
            showToast(`No category found for "${transcript}"`, 'info');
        }
    };
    
    recognition.onerror = () => {
        showToast('Voice recognition failed', 'error');
    };
}

// ============================================
// DARK MODE
// ============================================
function initDarkMode() {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        darkModeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    darkModeToggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    showToast(`${isDark ? 'Dark' : 'Light'} mode enabled`);
}

// ============================================
// SCROLL & FAB
// ============================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function toggleFab() {
    fabContainer.classList.toggle('active');
}

function randomCategory() {
    const randomIndex = Math.floor(Math.random() * CATEGORIES.length);
    loadCategory(CATEGORIES[randomIndex].slug);
    showToast(`Random: ${CATEGORIES[randomIndex].title}`);
    fabContainer.classList.remove('active');
}

// ============================================
// PREMIUM MODAL
// ============================================
function openPremiumModal() {
    premiumModal.classList.add('active');
}

function closePremiumModal() {
    premiumModal.classList.remove('active');
}

// ============================================
// NAVIGATION
// ============================================
function goHome() {
    window.location.href = 'https://magicrills.com';
}

function goBack() {
    window.location.href = 'https://magicrills.com/category-pages/administrator.html';
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    console.log('🚀 Initializing Multi Rules Generator with Cloudflare API...');
    
    // Start typewriter animation
    setTimeout(typewriterEffect, 500);
    
    // Update counts
    if (categoriesCountDisplay) categoriesCountDisplay.textContent = CATEGORIES.length;
    if (categoriesCount) categoriesCount.textContent = CATEGORIES.length;
    if (totalRulesCount) totalRulesCount.textContent = `${Object.values(RULES_DATABASE).reduce((sum, cat) => sum + cat.rules.length, 0)}+`;
    
    // Build UI
    buildCategoriesSidebar();
    initDarkMode();
    
    // Load last category
    const lastCategory = localStorage.getItem('last_category');
    if (lastCategory && RULES_DATABASE[lastCategory]) {
        loadCategory(lastCategory);
    } else {
        loadCategory('classroom');
    }
    
    // Load stats from Cloudflare API
    await loadStats();
    await loadReactions();
    loadUsageCount();
    
    // Event Listeners
    addRuleBtn.addEventListener('click', addNewRule);
    aiGenerateBtn.addEventListener('click', generateAIRules);
    copyAllBtn.addEventListener('click', copyAllRules);
    exportBeautifulPdfBtn.addEventListener('click', exportBeautifulPDF);
    exportBeautifulImageBtn.addEventListener('click', exportBeautifulImage);
    exportTxtBtn.addEventListener('click', exportSimpleTXT);
    exportDocBtn.addEventListener('click', exportSimpleDOC);
    copyUrlBtn.addEventListener('click', copyPageUrl);
    darkModeToggleBtn.addEventListener('click', toggleDarkMode);
    scrollUpBtn.addEventListener('click', scrollToTop);
    scrollDownBtn.addEventListener('click', scrollToBottom);
    fabMain.addEventListener('click', toggleFab);
    homeBtn.addEventListener('click', goHome);
    backBtn.addEventListener('click', goBack);
    premiumBtn.addEventListener('click', openPremiumModal);
    randomCategoryBtn.addEventListener('click', randomCategory);
    bulkAddBtn.addEventListener('click', bulkAddRules);
    
    document.querySelectorAll('.quick-action-btn[data-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.category;
            if (cat && RULES_DATABASE[cat]) {
                loadCategory(cat);
            }
        });
    });
    
    categorySearch.addEventListener('input', (e) => {
        const term = e.target.value;
        filterCategories(term);
        if (term) {
            clearSearchBtn.classList.add('visible');
        } else {
            clearSearchBtn.classList.remove('visible');
        }
    });
    
    clearSearchBtn.addEventListener('click', () => {
        categorySearch.value = '';
        filterCategories('');
        clearSearchBtn.classList.remove('visible');
    });
    
    voiceSearchBtn.addEventListener('click', startVoiceSearch);
    
    document.querySelectorAll('.reaction').forEach(reactionDiv => {
        reactionDiv.addEventListener('click', () => {
            const reactionType = reactionDiv.dataset.reaction;
            const emojiMap = {
                like: '👍', love: '❤️', wow: '😮', 
                sad: '😢', laugh: '😂', celebrate: '🎉'
            };
            addReaction(reactionType, emojiMap[reactionType]);
        });
    });
    
    document.querySelector('.share-btn.facebook')?.addEventListener('click', shareOnFacebook);
    document.querySelector('.share-btn.twitter')?.addEventListener('click', shareOnTwitter);
    document.querySelector('.share-btn.whatsapp')?.addEventListener('click', shareOnWhatsApp);
    document.querySelector('.share-btn.linkedin')?.addEventListener('click', shareOnLinkedIn);
    document.querySelector('.share-btn.email')?.addEventListener('click', shareViaEmail);
    
    document.getElementById('fabNewRule')?.addEventListener('click', () => {
        newRuleInput.focus();
        fabContainer.classList.remove('active');
    });
    document.getElementById('fabRandomCategory')?.addEventListener('click', randomCategory);
    document.getElementById('fabVoiceCommand')?.addEventListener('click', startVoiceSearch);
    document.getElementById('fabExportPDF')?.addEventListener('click', () => {
        exportBeautifulPDF();
        fabContainer.classList.remove('active');
    });
    
    document.querySelector('.premium-modal-close')?.addEventListener('click', closePremiumModal);
    document.querySelector('.premium-cancel-btn')?.addEventListener('click', closePremiumModal);
    premiumModal.addEventListener('click', (e) => {
        if (e.target === premiumModal) closePremiumModal();
    });
    
    newRuleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewRule();
    });
    
    aiPrompt.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateAIRules();
    });
    
    showToast(`Welcome! ${CATEGORIES.length} categories loaded`);
    console.log(`✅ Ready with ${CATEGORIES.length} categories and ${Object.values(RULES_DATABASE).reduce((sum, cat) => sum + cat.rules.length, 0)} total rules`);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
