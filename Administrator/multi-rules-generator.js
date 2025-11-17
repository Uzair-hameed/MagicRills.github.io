// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const ruleCategory = document.getElementById('ruleCategory');
    const rulesContainer = document.getElementById('rulesContainer');
    const newRuleText = document.getElementById('newRuleText');
    const saveRuleBtn = document.getElementById('saveRuleBtn');
    const addRuleBtn = document.getElementById('addRuleBtn');
    const exportBtn = document.getElementById('exportBtn');
    const showNumbersToggle = document.getElementById('showNumbersToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const schoolName = document.getElementById('schoolName');
    const schoolLogo = document.getElementById('schoolLogo');
    const logoPreview = document.getElementById('logoPreview');
    const ruleTheme = document.getElementById('ruleTheme');
    const aiPrompt = document.getElementById('aiPrompt');
    const aiApiKey = document.getElementById('aiApiKey');
    const generateAiRules = document.getElementById('generateAiRules');
    const exportModal = document.getElementById('exportModal');
    const closeModal = document.querySelector('.close');
    const exportOptions = document.querySelectorAll('.export-option');
    const totalRulesEl = document.getElementById('totalRules');
    const currentCategoryEl = document.getElementById('currentCategory');
    const lastUpdatedEl = document.getElementById('lastUpdated');
    const rulesTitle = document.getElementById('rulesTitle');

    // Application state
    let currentRules = [];
    let currentCategory = '';
    let lastUpdated = new Date();
    let schoolLogoData = null;

    // Enhanced Rules Data with 30+ categories
    const rulesData = {
        classroom: {
            title: "Classroom Rules",
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
                "Electronic devices are only to be used with teacher permission."
            ]
        },
        boarding: {
            title: "Boarding House Rules",
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
                "Respect lights-out times."
            ]
        },
        science: {
            title: "Science Lab Rules",
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
                "Follow instructions precisely; never improvise procedures."
            ]
        },
        computer: {
            title: "Computer Lab Rules",
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
                "Use headphones when working with audio."
            ]
        },
        library: {
            title: "Library Rules",
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
                "Mobile phones should be on silent mode."
            ]
        },
        playground: {
            title: "Playground Rules",
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
                "Dress appropriately for outdoor play."
            ]
        },
        exam: {
            title: "Examination Hall Rules",
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
                "Follow all time limits and stop writing when instructed."
            ]
        },
        training: {
            title: "Training Hall Rules",
            rules: [
                "Arrive on time for all scheduled sessions.",
                "Wear appropriate athletic attire and footwear.",
                "Follow all instructions from coaches and trainers.",
                "Use equipment properly and return it after use.",
                "Report any equipment damage immediately.",
                "Stay hydrated but keep drinks in designated areas.",
                "Respect other participants and their space.",
                "Warm up properly before intensive activities.",
                "Clean up your area when finished training.",
                "Use spotters when attempting heavy lifts."
            ]
        },
        canteen: {
            title: "Canteen Rules",
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
                "Keep noise at a reasonable level."
            ]
        },
        general: {
            title: "General School Rules",
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
                "Electronic devices may only be used with permission."
            ]
        },
        kindergarten: {
            title: "Kindergarten Rules",
            rules: [
                "Use walking feet inside the classroom.",
                "Use indoor voices when speaking.",
                "Keep hands and feet to yourself.",
                "Share toys and materials with friends.",
                "Clean up after playing with toys.",
                "Listen when the teacher is speaking.",
                "Follow directions the first time they are given.",
                "Be kind and helpful to classmates.",
                "Use words to express feelings.",
                "Take turns during games and activities."
            ]
        },
        elementary: {
            title: "Elementary School Rules",
            rules: [
                "Be respectful to teachers and classmates.",
                "Complete homework assignments on time.",
                "Walk quietly in the hallways.",
                "Use restroom breaks appropriately.",
                "Keep personal belongings organized.",
                "Participate actively in class activities.",
                "Ask for help when needed.",
                "Follow playground safety rules.",
                "Use technology responsibly.",
                "Be honest in all situations."
            ]
        },
        highschool: {
            title: "High School Rules",
            rules: [
                "Maintain academic integrity in all work.",
                "Attend all classes regularly.",
                "Meet assignment deadlines consistently.",
                "Use school resources responsibly.",
                "Participate in school activities.",
                "Respect diverse opinions and backgrounds.",
                "Follow technology usage policies.",
                "Maintain appropriate relationships with staff.",
                "Take responsibility for personal actions.",
                "Prepare for college and career readiness."
            ]
        },
        college: {
            title: "College Rules",
            rules: [
                "Adhere to academic honor code.",
                "Attend lectures and seminars regularly.",
                "Submit assignments by deadlines.",
                "Respect intellectual property rights.",
                "Use campus facilities responsibly.",
                "Participate in academic discussions.",
                "Maintain professional conduct.",
                "Follow research ethics guidelines.",
                "Use library resources appropriately.",
                "Engage in campus community activities."
            ]
        },
        online: {
            title: "Online Class Rules",
            rules: [
                "Join classes on time with camera ready.",
                "Mute microphone when not speaking.",
                "Use appropriate virtual backgrounds.",
                "Participate actively in discussions.",
                "Submit assignments through proper channels.",
                "Respect privacy of classmates.",
                "Use chat feature appropriately.",
                "Follow netiquette guidelines.",
                "Test technology before classes.",
                "Maintain professional online presence."
            ]
        },
        art: {
            title: "Art Room Rules",
            rules: [
                "Wear appropriate protective clothing.",
                "Clean brushes and tools after use.",
                "Use materials only as intended.",
                "Respect others' artwork and space.",
                "Clean work area before leaving.",
                "Follow specific material instructions.",
                "Store artwork in designated areas.",
                "Report damaged equipment immediately.",
                "Use proper ventilation when needed.",
                "Respect drying times for artwork."
            ]
        },
        music: {
            title: "Music Room Rules",
            rules: [
                "Handle instruments with care.",
                "Wash hands before using instruments.",
                "Return instruments to proper storage.",
                "Follow conductor's directions.",
                "Practice assigned pieces regularly.",
                "Respect practice schedule times.",
                "Keep music sheets organized.",
                "Use appropriate volume levels.",
                "Report instrument damage immediately.",
                "Maintain focus during rehearsals."
            ]
        },
        sports: {
            title: "Sports Rules",
            rules: [
                "Follow coach's instructions immediately.",
                "Wear appropriate safety gear.",
                "Respect opponents and officials.",
                "Play fairly and follow game rules.",
                "Support and encourage teammates.",
                "Accept decisions gracefully.",
                "Maintain sportsmanship at all times.",
                "Stay within designated areas.",
                "Report injuries immediately.",
                "Clean up after games and practices."
            ]
        },
        swimming: {
            title: "Swimming Pool Rules",
            rules: [
                "No running on pool deck.",
                "Shower before entering pool.",
                "No diving in shallow water.",
                "Follow lifeguard instructions immediately.",
                "Use appropriate swimwear only.",
                "No glass containers near pool.",
                "Report any accidents immediately.",
                "Respect swimming lane etiquette.",
                "No rough play or dunking.",
                "Exit pool during lightning storms."
            ]
        },
        gym: {
            title: "Gym Rules",
            rules: [
                "Wipe down equipment after use.",
                "Return weights to proper racks.",
                "Use spotters for heavy lifts.",
                "Respect others' personal space.",
                "Follow posted time limits on equipment.",
                "Use proper form during exercises.",
                "Report equipment malfunctions.",
                "Wear appropriate workout attire.",
                "Stay hydrated during workouts.",
                "Follow class instructor directions."
            ]
        },
        auditorium: {
            title: "Auditorium Rules",
            rules: [
                "Enter and exit quietly during performances.",
                "Turn off electronic devices.",
                "No food or drinks in seating area.",
                "Remain seated during performances.",
                "Applaud at appropriate times.",
                "Follow usher instructions.",
                "Keep aisles clear at all times.",
                "Reserve seating for disabled persons.",
                "Use restrooms before performance starts.",
                "Stay until performance concludes."
            ]
        },
        cafeteria: {
            title: "Cafeteria Rules",
            rules: [
                "Wait patiently in service lines.",
                "Use tray provided for food items.",
                "Clear table after eating.",
                "Return trays to designated area.",
                "Use appropriate noise level.",
                "Respect cafeteria staff.",
                "Follow recycling guidelines.",
                "Report spills immediately.",
                "No saving tables for large groups.",
                "Dispose of waste properly."
            ]
        },
        dormitory: {
            title: "Dormitory Rules",
            rules: [
                "Observe quiet hours respectfully.",
                "No unauthorized room changes.",
                "Respect roommate's privacy.",
                "Keep common areas clean.",
                "No candles or open flames.",
                "Report maintenance issues promptly.",
                "Follow guest visitation rules.",
                "Use kitchen facilities responsibly.",
                "Respect fire safety procedures.",
                "Attend mandatory floor meetings."
            ]
        },
        bus: {
            title: "School Bus Rules",
            rules: [
                "Remain seated while bus is moving.",
                "Keep aisles clear of belongings.",
                "Use inside voices on bus.",
                "Follow driver's instructions immediately.",
                "No eating or drinking on bus.",
                "Keep hands and heads inside windows.",
                "Respect bus property and equipment.",
                "Use assigned bus stops only.",
                "Help keep bus clean.",
                "Be at stop 5 minutes before pickup."
            ]
        },
        parking: {
            title: "Parking Lot Rules",
            rules: [
                "Observe speed limit signs.",
                "Park in designated spaces only.",
                "Yield to pedestrians at all times.",
                "No idling vehicles unnecessarily.",
                "Follow one-way traffic patterns.",
                "No parking in fire lanes.",
                "Display parking permit properly.",
                "Report suspicious activity immediately.",
                "Use crosswalks when walking.",
                "Reserve handicapped spaces appropriately."
            ]
        },
        restroom: {
            title: "Restroom Rules",
            rules: [
                "Respect others' privacy.",
                "Keep restroom clean and tidy.",
                "Wash hands with soap and water.",
                "Report maintenance issues promptly.",
                "Use appropriate waste receptacles.",
                "No loitering in restrooms.",
                "Respect designated restroom facilities.",
                "Conserve water and supplies.",
                "No vandalism of property.",
                "Use facilities quickly during class time."
            ]
        },
        hallway: {
            title: "Hallway Rules",
            rules: [
                "Walk on the right side.",
                "Keep movement orderly and calm.",
                "Use inside voices in hallways.",
                "Keep backpacks and bags close.",
                "No running or rough play.",
                "Respect displays and bulletin boards.",
                "Keep locker areas organized.",
                "Move directly to destination.",
                "Hold doors open for others.",
                "No congregating in traffic areas."
            ]
        },
        staircase: {
            title: "Staircase Rules",
            rules: [
                "Use handrails at all times.",
                "Walk up and down stairs carefully.",
                "Keep to the right on staircases.",
                "No running on stairs.",
                "Keep stairs clear of obstacles.",
                "No sitting on staircases.",
                "Use designated up and down staircases.",
                "Carry items safely on stairs.",
                "Watch step edges carefully.",
                "Report any staircase hazards immediately."
            ]
        },
        emergency: {
            title: "Emergency Procedures",
            rules: [
                "Follow evacuation routes immediately.",
                "Remain calm during emergencies.",
                "Listen for instructions from staff.",
                "Assemble at designated areas.",
                "Account for all students in group.",
                "No re-entry until all clear given.",
                "Know location of emergency equipment.",
                "Practice emergency drills seriously.",
                "Report emergency situations immediately.",
                "Follow specific emergency protocols."
            ]
        },
        cyber: {
            title: "Cyber Safety Rules",
            rules: [
                "Keep personal information private.",
                "Use strong, unique passwords.",
                "Report suspicious online activity.",
                "Respect others' digital privacy.",
                "Think before posting online.",
                "Use school networks appropriately.",
                "Follow acceptable use policies.",
                "Protect devices from malware.",
                "Back up important data regularly.",
                "Use privacy settings appropriately."
            ]
        },
        social: {
            title: "Social Media Rules",
            rules: [
                "Represent school positively online.",
                "Think before posting or sharing.",
                "Respect others' digital reputation.",
                "Report cyberbullying immediately.",
                "Use appropriate language online.",
                "Follow school social media guidelines.",
                "Protect personal information online.",
                "Credit sources when sharing content.",
                "Use privacy settings effectively.",
                "Balance online and offline activities."
            ]
        },
        fieldtrip: {
            title: "Field Trip Rules",
            rules: [
                "Stay with assigned group at all times.",
                "Follow chaperone instructions immediately.",
                "Wear identification badge visibly.",
                "Use appropriate behavior in public.",
                "Stay within designated areas.",
                "Report to chaperones regularly.",
                "Respect venue rules and property.",
                "Use buddy system when appropriate.",
                "Follow scheduled timeline strictly.",
                "Represent school positively off-campus."
            ]
        }
    };

    // Initialize the application
    function init() {
        loadRulesData();
        setupEventListeners();
        updateStats();
        applySavedSettings();
    }

    // Event Listeners
    function setupEventListeners() {
        ruleCategory.addEventListener('change', handleCategoryChange);
        saveRuleBtn.addEventListener('click', addNewRule);
        addRuleBtn.addEventListener('click', focusNewRuleInput);
        exportBtn.addEventListener('click', openExportModal);
        showNumbersToggle.addEventListener('change', updateRulesDisplay);
        darkModeToggle.addEventListener('change', toggleDarkMode);
        ruleTheme.addEventListener('change', changeTheme);
        generateAiRules.addEventListener('click', generateRulesWithAI);
        closeModal.addEventListener('click', closeExportModal);
        schoolLogo.addEventListener('change', handleLogoUpload);
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === exportModal) {
                closeExportModal();
            }
        });
        
        // Export option clicks
        exportOptions.forEach(option => {
            option.addEventListener('click', function() {
                const format = this.getAttribute('data-format');
                exportRules(format);
            });
        });
        
        // Allow pressing Enter to add new rule
        newRuleText.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addNewRule();
            }
        });

        // Allow pressing Enter in AI prompt
        aiPrompt.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateRulesWithAI();
            }
        });
    }

    // Handle logo upload
    function handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            schoolLogoData = e.target.result;
            logoPreview.innerHTML = `<img src="${schoolLogoData}" alt="School Logo">`;
        };
        reader.readAsDataURL(file);
    }

    // Handle category change
    function handleCategoryChange() {
        const category = ruleCategory.value;
        
        if (category) {
            currentCategory = category;
            loadRules(category);
            updateStats();
        } else {
            rulesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No Rules Yet</h3>
                    <p>Select a category or create custom rules to get started</p>
                </div>
            `;
            currentCategoryEl.textContent = '-';
            totalRulesEl.textContent = '0';
        }
    }

    // Load rules for a category
    function loadRules(category) {
        if (rulesData[category]) {
            currentRules = [...rulesData[category].rules];
            updateRulesDisplay();
        }
    }

    // Update rules display
    function updateRulesDisplay() {
        if (!currentCategory) return;
        
        const title = rulesData[currentCategory].title;
        rulesTitle.textContent = title;
        
        rulesContainer.innerHTML = '';
        
        if (currentRules.length === 0) {
            rulesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No Rules in This Category</h3>
                    <p>Add rules using the input below</p>
                </div>
            `;
            return;
        }
        
        currentRules.forEach((rule, index) => {
            const ruleItem = document.createElement('div');
            ruleItem.className = 'rule-item';
            
            if (showNumbersToggle.checked) {
                const number = document.createElement('div');
                number.className = 'rule-number';
                number.textContent = (index + 1) + '.';
                ruleItem.appendChild(number);
            }
            
            const text = document.createElement('div');
            text.className = 'rule-text';
            text.textContent = rule;
            text.contentEditable = 'true';
            text.addEventListener('blur', function() {
                currentRules[index] = this.textContent;
                updateLastUpdated();
                updateStats();
            });
            ruleItem.appendChild(text);
            
            const actions = document.createElement('div');
            actions.className = 'rule-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                currentRules.splice(index, 1);
                updateRulesDisplay();
                updateLastUpdated();
                updateStats();
            });
            actions.appendChild(deleteBtn);
            
            ruleItem.appendChild(actions);
            rulesContainer.appendChild(ruleItem);
        });
        
        updateLastUpdated();
        updateStats();
    }

    // Add new rule
    function addNewRule() {
        const ruleText = newRuleText.value.trim();
        
        if (ruleText) {
            if (!currentCategory) {
                alert('Please select a rule category first');
                return;
            }
            
            currentRules.push(ruleText);
            updateRulesDisplay();
            newRuleText.value = '';
            updateLastUpdated();
            updateStats();
            showNotification('Rule added successfully!', 'success');
        }
    }

    // Focus on new rule input
    function focusNewRuleInput() {
        if (!currentCategory) {
            alert('Please select a rule category first');
            return;
        }
        
        newRuleText.focus();
    }

    // Update stats
    function updateStats() {
        totalRulesEl.textContent = currentRules.length;
        currentCategoryEl.textContent = currentCategory ? rulesData[currentCategory].title : '-';
    }

    // Update last updated time
    function updateLastUpdated() {
        lastUpdated = new Date();
        lastUpdatedEl.textContent = lastUpdated.toLocaleTimeString();
    }

    // Toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', darkModeToggle.checked ? 'enabled' : 'disabled');
    }

    // Change theme
    function changeTheme() {
        const theme = ruleTheme.value;
        document.body.className = '';
        
        if (theme !== 'default') {
            document.body.classList.add(`theme-${theme}`);
        }
        
        localStorage.setItem('ruleTheme', theme);
    }

    // Generate rules with AI
    async function generateRulesWithAI() {
        const prompt = aiPrompt.value.trim();
        const apiKey = aiApiKey.value.trim();
        
        if (!prompt) {
            alert('Please enter a description for the rules you want to generate');
            return;
        }
        
        if (!currentCategory) {
            alert('Please select a rule category first');
            return;
        }

        if (!apiKey) {
            // Use simulated AI generation if no API key
            simulateAIGeneration(prompt);
            return;
        }

        // Show loading state
        generateAiRules.textContent = 'Generating...';
        generateAiRules.disabled = true;
        
        try {
            const generatedRules = await callOpenAI(prompt, apiKey);
            
            // Add generated rules to current rules
            currentRules = [...currentRules, ...generatedRules];
            updateRulesDisplay();
            updateLastUpdated();
            updateStats();
            
            showNotification(`${generatedRules.length} AI rules generated successfully!`, 'success');
        } catch (error) {
            console.error('AI Generation Error:', error);
            showNotification('AI generation failed. Using simulated rules.', 'error');
            // Fallback to simulated generation
            simulateAIGeneration(prompt);
        } finally {
            // Reset button
            generateAiRules.textContent = 'Generate Rules';
            generateAiRules.disabled = false;
            aiPrompt.value = '';
        }
    }

    // Call OpenAI API
    async function callOpenAI(prompt, apiKey) {
        const category = rulesData[currentCategory].title;
        const systemPrompt = `You are a rules generator for educational institutions. Generate 3-5 clear, concise rules based on the user's description. Rules should be practical, enforceable, and appropriate for the context. Format each rule as a separate line without numbers.`;
        
        const userPrompt = `Category: ${category}\nDescription: ${prompt}\nGenerate 3-5 specific rules:`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const rulesText = data.choices[0].message.content;
        
        // Parse the response into individual rules
        const rules = rulesText.split('\n')
            .map(rule => rule.replace(/^\d+\.\s*/, '').trim())
            .filter(rule => rule.length > 10); // Filter out very short lines
        
        return rules.length > 0 ? rules : ['Follow instructions from supervisors.', 'Maintain respectful behavior.', 'Report any issues immediately.'];
    }

    // Simulate AI generation (fallback)
    function simulateAIGeneration(prompt) {
        generateAiRules.textContent = 'Generating...';
        generateAiRules.disabled = true;
        
        setTimeout(() => {
            const sampleRules = [
                "Always follow instructions from supervisors.",
                "Maintain a positive and respectful attitude.",
                "Report any issues or concerns immediately.",
                "Keep your workspace clean and organized.",
                "Respect the time and space of others.",
                "Use equipment and materials properly.",
                "Communicate clearly and respectfully.",
                "Follow all safety procedures carefully.",
                "Participate actively in activities.",
                "Be responsible for your own actions."
            ];
            
            const count = Math.min(5, Math.max(3, Math.floor(Math.random() * 5) + 1));
            const generatedRules = sampleRules.slice(0, count);
            
            currentRules = [...currentRules, ...generatedRules];
            updateRulesDisplay();
            updateLastUpdated();
            updateStats();
            
            generateAiRules.textContent = 'Generate Rules';
            generateAiRules.disabled = false;
            aiPrompt.value = '';
            
            showNotification(`${generatedRules.length} rules generated successfully!`, 'success');
        }, 1500);
    }

    // Show notification
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type === 'error' ? 'notification-error' : ''}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? 'var(--danger-color)' : 'var(--success-color)'};
            color: white;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Open export modal
    function openExportModal() {
        if (!currentCategory) {
            alert('Please select a rule category first');
            return;
        }
        
        if (currentRules.length === 0) {
            alert('No rules to export. Please add some rules first.');
            return;
        }
        
        exportModal.style.display = 'block';
    }

    // Close export modal
    function closeExportModal() {
        exportModal.style.display = 'none';
    }

    // Export rules in specified format
    function exportRules(format) {
        closeExportModal();
        
        switch (format) {
            case 'pdf':
                exportToPDF();
                break;
            case 'excel':
                exportToExcel();
                break;
            case 'word':
                exportToWord();
                break;
            case 'text':
                exportToText();
                break;
        }
    }

    // Export to PDF
    function exportToPDF() {
        if (!currentCategory || currentRules.length === 0) {
            alert('No rules to export. Please select a category and add rules first.');
            return;
        }

        try {
            // Prepare export template
            prepareExportTemplate();
            
            // Use html2canvas to capture the template
            const exportTemplate = document.getElementById('exportTemplate');
            const templateContent = exportTemplate.querySelector('.export-template');
            
            html2canvas(templateContent, {
                scale: 2,
                useCORS: true,
                logging: false
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                const title = (schoolName.value ? schoolName.value + ': ' : '') + rulesData[currentCategory].title;
                doc.save(title.replace(/[^a-z0-9]/gi, '_') + '.pdf');
                
                showNotification('PDF exported successfully!', 'success');
            });
        } catch (error) {
            console.error('PDF export error:', error);
            showNotification('Error generating PDF. Please try again.', 'error');
        }
    }

    // Prepare export template
    function prepareExportTemplate() {
        const exportSchoolName = document.getElementById('exportSchoolName');
        const exportCategory = document.getElementById('exportCategory');
        const exportDate = document.getElementById('exportDate');
        const exportLogo = document.getElementById('exportLogo');
        const exportRulesList = document.getElementById('exportRulesList');
        const exportPageNumber = document.getElementById('exportPageNumber');
        
        // Set content
        exportSchoolName.textContent = schoolName.value || 'School Name';
        exportCategory.textContent = rulesData[currentCategory].title;
        exportDate.textContent = new Date().toLocaleDateString();
        exportPageNumber.textContent = 'Page 1 of 1';
        
        // Set logo
        if (schoolLogoData) {
            exportLogo.innerHTML = `<img src="${schoolLogoData}" alt="School Logo">`;
        } else {
            exportLogo.innerHTML = '<span>Logo</span>';
        }
        
        // Build rules list
        exportRulesList.innerHTML = '';
        const showNumbers = showNumbersToggle.checked;
        
        currentRules.forEach((rule, index) => {
            const ruleItem = document.createElement('div');
            ruleItem.className = 'rule-item-export';
            
            if (showNumbers) {
                const number = document.createElement('div');
                number.className = 'rule-number-export';
                number.textContent = (index + 1) + '.';
                ruleItem.appendChild(number);
            }
            
            const text = document.createElement('div');
            text.className = 'rule-text-export';
            text.textContent = rule;
            ruleItem.appendChild(text);
            
            exportRulesList.appendChild(ruleItem);
        });
    }

    // Export to Excel
    function exportToExcel() {
        if (!currentCategory || currentRules.length === 0) {
            alert('No rules to export. Please select a category and add rules first.');
            return;
        }

        try {
            const title = (schoolName.value ? schoolName.value + ': ' : '') + rulesData[currentCategory].title;
            const showNumbers = showNumbersToggle.checked;
            const date = new Date().toLocaleDateString();
            
            // Create worksheet data
            const worksheetData = [
                [title],
                ['Generated on:', date],
                [''],
                ['Rule Number', 'Rule Description']
            ];
            
            // Add rules to worksheet
            currentRules.forEach((rule, index) => {
                const ruleNumber = showNumbers ? (index + 1) : '';
                worksheetData.push([ruleNumber, rule]);
            });
            
            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);
            
            // Style the worksheet (basic styling)
            if (!ws['!cols']) ws['!cols'] = [];
            ws['!cols'][0] = { width: 15 }; // Rule Number column
            ws['!cols'][1] = { width: 80 }; // Rule Description column
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Rules');
            
            // Generate Excel file and download
            XLSX.writeFile(wb, title.replace(/[^a-z0-9]/gi, '_') + '.xlsx');
            
            showNotification('Excel file exported successfully!', 'success');
        } catch (error) {
            console.error('Excel export error:', error);
            showNotification('Error generating Excel file. Please try again.', 'error');
        }
    }

    // Export to Word (simplified as text file with .doc extension)
    function exportToWord() {
        if (!currentCategory || currentRules.length === 0) {
            alert('No rules to export. Please select a category and add rules first.');
            return;
        }

        try {
            const title = (schoolName.value ? schoolName.value + ': ' : '') + rulesData[currentCategory].title;
            const showNumbers = showNumbersToggle.checked;
            const date = new Date().toLocaleDateString();
            
            let content = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4361ee; padding-bottom: 20px; }
                        .school-name { font-size: 24px; color: #4361ee; margin-bottom: 10px; }
                        .category { font-size: 18px; color: #666; margin-bottom: 10px; }
                        .date { font-size: 14px; color: #888; }
                        .rules-title { text-align: center; font-size: 20px; color: #4361ee; margin: 30px 0; }
                        .rule-item { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-left: 4px solid #4cc9f0; }
                        .rule-number { font-weight: bold; color: #4361ee; display: inline-block; width: 30px; }
                        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; display: flex; justify-content: space-between; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="school-name">${schoolName.value || 'School Name'}</div>
                        <div class="category">${rulesData[currentCategory].title}</div>
                        <div class="date">Generated on: ${date}</div>
                    </div>
                    <div class="rules-title">Rules & Regulations</div>
            `;
            
            currentRules.forEach((rule, index) => {
                const prefix = showNumbers ? `<span class="rule-number">${index + 1}.</span>` : '';
                content += `<div class="rule-item">${prefix} ${rule}</div>`;
            });
            
            content += `
                    <div class="footer">
                        <div>Official Document</div>
                        <div>Generated by Multi Rules Generator</div>
                    </div>
                </body>
                </html>
            `;
            
            const blob = new Blob([content], { type: 'application/msword' });
            saveAs(blob, title.replace(/[^a-z0-9]/gi, '_') + '.doc');
            
            showNotification('Word document exported successfully!', 'success');
        } catch (error) {
            console.error('Word export error:', error);
            showNotification('Error generating Word document. Please try again.', 'error');
        }
    }

    // Export to Text
    function exportToText() {
        if (!currentCategory || currentRules.length === 0) {
            alert('No rules to export. Please select a category and add rules first.');
            return;
        }

        try {
            const title = (schoolName.value ? schoolName.value + ': ' : '') + rulesData[currentCategory].title;
            const showNumbers = showNumbersToggle.checked;
            const date = new Date().toLocaleDateString();
            
            let content = `${title}\n\n`;
            content += `Generated on: ${date}\n\n`;
            content += 'RULES:\n\n';
            
            currentRules.forEach((rule, index) => {
                const prefix = showNumbers ? `${index + 1}. ` : '- ';
                content += `${prefix}${rule}\n`;
            });
            
            const blob = new Blob([content], { type: 'text/plain' });
            saveAs(blob, title.replace(/[^a-z0-9]/gi, '_') + '.txt');
            
            showNotification('Text file exported successfully!', 'success');
        } catch (error) {
            console.error('Text export error:', error);
            showNotification('Error generating text file. Please try again.', 'error');
        }
    }

    // Apply saved settings
    function applySavedSettings() {
        // Dark mode
        if (localStorage.getItem('darkMode') === 'enabled') {
            darkModeToggle.checked = true;
            document.body.classList.add('dark-mode');
        }
        
        // Theme
        const savedTheme = localStorage.getItem('ruleTheme');
        if (savedTheme) {
            ruleTheme.value = savedTheme;
            changeTheme();
        }
    }

    // Load rules data
    function loadRulesData() {
        console.log('Rules data loaded successfully');
    }

    // Initialize the app
    init();
});