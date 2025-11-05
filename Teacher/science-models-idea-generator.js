// Science Models Idea Generator - Advanced JavaScript
class ScienceModelGenerator {
    constructor() {
        this.initializeApp();
        this.bindEvents();
        this.modelsGenerated = 0;
    }

    initializeApp() {
        // API configuration
        this.API_KEY = "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";
        this.API_URL = "https://openrouter.ai/api/v1/chat/completions";
        this.apiConnected = false;
        
        // Initialize theme
        this.currentTheme = localStorage.getItem('science-theme') || 'light';
        this.applyTheme(this.currentTheme);
        
        // Model types database
        this.modelTypes = {
            general: [
                "Solar System Model", "Volcano Eruption", "Water Cycle", 
                "Simple Electric Circuit", "Magnetic Field Demonstration",
                "Weather Station", "Seed Germination", "States of Matter",
                "Simple Machine", "Ecosystem in a Bottle"
            ],
            biology: [
                "Cell Structure Model", "DNA Double Helix", 
                "Plant and Animal Cell Comparison", "Human Digestive System",
                "Photosynthesis Process", "Mitosis and Meiosis",
                "Respiratory System", "Circulatory System",
                "Nervous System", "Evolution Timeline"
            ],
            physics: [
                "Newton's Cradle", "Pulley System", "Electromagnet",
                "Simple Pendulum", "Light Refraction", 
                "Sound Waves Demonstration", "Static Electricity",
                "Energy Transformation", "Center of Gravity", 
                "Momentum Conservation"
            ],
            chemistry: [
                "Atomic Structure", "Periodic Table Display", 
                "Chemical Bonding Models", "Acid-Base Reaction",
                "Crystal Growing", "Electrolysis of Water",
                "Distillation Setup", "pH Indicator from Natural Sources",
                "Combustion Reaction", "Polymer Creation"
            ],
            anatomy: [
                "Human Skeleton", "Muscle System", "Brain Model",
                "Heart Structure", "Eye Anatomy", "Ear Model",
                "Skin Layers", "Tooth Structure", "Joint Types",
                "Organ Systems"
            ],
            astronomy: [
                "Phases of the Moon", "Solar and Lunar Eclipse",
                "Planet Size Comparison", "Constellation Projector",
                "Rocket Model", "Telescope Construction",
                "Black Hole Model", "Galaxy Types", 
                "Space Station", "Asteroid Belt"
            ],
            "earth-science": [
                "Plate Tectonics", "Rock Cycle", "Soil Layers",
                "Earth's Layers", "Weathering and Erosion",
                "Fossil Formation", "Glacier Movement",
                "Earthquake Simulator", "Volcano Types", 
                "Water Filtration"
            ],
            environmental: [
                "Greenhouse Effect", "Composting System",
                "Renewable Energy Models", "Water Pollution Demonstration",
                "Air Quality Monitor", "Biome Diorama",
                "Carbon Cycle", "Food Web", "Waste Management",
                "Sustainable City"
            ]
        };

        // Predefined model data
        this.predefinedModels = {
            "solar-system-model": {
                title: "Solar System Model",
                objective: "To help students understand the relative sizes, distances, and characteristics of planets in our solar system.",
                materials: [
                    "Styrofoam balls of various sizes",
                    "Wooden skewers",
                    "Acrylic paints and brushes",
                    "Black poster board",
                    "Glue",
                    "String",
                    "Flashlight (for Sun)"
                ],
                steps: [
                    "Research the relative sizes and colors of planets",
                    "Paint Styrofoam balls to represent each planet",
                    "Attach planets to skewers and position them on the poster board",
                    "Label each planet and include interesting facts",
                    "Use string to show orbital paths"
                ],
                concepts: [
                    "Planetary orbits and revolution",
                    "Relative sizes and distances in space",
                    "Planet composition and characteristics"
                ],
                resources: [
                    "NASA Solar System Exploration website",
                    "Books: 'The Magic School Bus Lost in the Solar System'",
                    "Educational videos about the solar system"
                ],
                tips: [
                    "Use accurate color representations for planets",
                    "Include dwarf planets like Pluto",
                    "Add moons for planets that have them",
                    "Create a scale model for accurate size/distance ratios"
                ],
                variations: [
                    "Create a 3D mobile version",
                    "Add LED lights to represent stars",
                    "Include asteroid belt between Mars and Jupiter",
                    "Model planetary rotation and revolution"
                ]
            },
            "cell-structure-model": {
                title: "Cell Structure Model",
                objective: "To demonstrate the basic structure and components of a typical plant or animal cell.",
                materials: [
                    "Large clear plastic container or bowl",
                    "Gelatin or cytoplasm substitute",
                    "Various small objects to represent organelles",
                    "Food coloring",
                    "Labels and markers"
                ],
                steps: [
                    "Prepare gelatin according to package instructions",
                    "Pour gelatin into container to represent cytoplasm",
                    "Add various objects to represent cell organelles",
                    "Use food coloring to differentiate structures",
                    "Label all parts of the cell"
                ],
                concepts: [
                    "Cell as the basic unit of life",
                    "Function of different organelles",
                    "Differences between plant and animal cells"
                ],
                resources: [
                    "Biology textbooks with cell diagrams",
                    "Online interactive cell models",
                    "Microscopic images of real cells"
                ],
                tips: [
                    "Use different textures for different organelles",
                    "Create both plant and animal cell versions",
                    "Compare prokaryotic and eukaryotic cells"
                ],
                variations: [
                    "Create edible cell models using cake or Jello",
                    "Build 3D models using clay or playdough",
                    "Make cross-sections to show internal structures"
                ]
            }
        };

        this.checkApiConnectivity();
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Science field change
        document.getElementById('scienceField').addEventListener('change', (e) => this.populateModelTypes(e.target.value));
        
        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => this.generateModelIdea());
        
        // Export buttons
        document.getElementById('exportPdf').addEventListener('click', () => this.exportAsPDF());
        document.getElementById('exportWord').addEventListener('click', () => this.exportAsWord());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareModel());
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
        localStorage.setItem('science-theme', theme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.showNotification(`Switched to ${this.currentTheme} mode`, 'success');
    }

    populateModelTypes(field) {
        const modelTypeSelect = document.getElementById('modelType');
        modelTypeSelect.innerHTML = '<option value="">Select Model Type</option>';
        
        if (field && this.modelTypes[field]) {
            this.modelTypes[field].forEach(type => {
                const option = document.createElement('option');
                option.value = type.toLowerCase().replace(/\s+/g, '-');
                option.textContent = type;
                modelTypeSelect.appendChild(option);
            });
        }
    }

    async generateModelIdea() {
        const educationLevel = document.getElementById('educationLevel').value;
        const scienceField = document.getElementById('scienceField').value;
        const modelType = document.getElementById('modelType').value;
        
        if (!educationLevel || !scienceField || !modelType) {
            this.showNotification('Please select all options before generating.', 'error');
            return;
        }

        this.showLoading(true);
        
        try {
            let modelIdea;
            
            if (this.apiConnected) {
                modelIdea = await this.generateWithAPI(educationLevel, scienceField, modelType);
            } else {
                modelIdea = this.generateFromDatabase(educationLevel, scienceField, modelType);
            }
            
            this.displayResult(modelIdea);
            this.updateStats();
            this.showNotification('Model idea generated successfully! 🎉', 'success');
        } catch (error) {
            console.error('Error generating model:', error);
            const fallbackIdea = this.generateFromDatabase(educationLevel, scienceField, modelType);
            this.displayResult(fallbackIdea);
            this.showNotification('Using local database for model generation', 'info');
        } finally {
            this.showLoading(false);
        }
    }

    async generateWithAPI(educationLevel, scienceField, modelType) {
        const prompt = `Create a detailed science model idea for ${educationLevel} level students in ${scienceField}. Model type: ${modelType}.
        
        Provide this structured information:
        1. Model Title
        2. Objective/Purpose
        3. Materials Needed (low-cost items)
        4. Step-by-Step Instructions
        5. Key Scientific Concepts
        6. Learning Resources
        7. Enhancement Tips
        8. Variations/Extensions
        
        Make it engaging and educational for ${educationLevel} students.`;

        const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat-v3.1:free",
                "messages": [{ "role": "user", "content": prompt }],
                "max_tokens": 1500
            })
        });

        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        return data.choices[0].message.content;
    }

    generateFromDatabase(educationLevel, scienceField, modelType) {
        if (this.predefinedModels[modelType]) {
            const model = this.predefinedModels[modelType];
            return this.formatModelData(model);
        } else {
            return this.generateGenericModel(educationLevel, scienceField, modelType);
        }
    }

    formatModelData(model) {
        return `
1. Model Title
${model.title}

2. Objective/Purpose
${model.objective}

3. Materials Needed
${model.materials.join('\n')}

4. Step-by-Step Instructions
${model.steps.join('\n')}

5. Key Scientific Concepts
${model.concepts.join('\n')}

6. Learning Resources
${model.resources.join('\n')}

7. Enhancement Tips
${model.tips.join('\n')}

8. Variations/Extensions
${model.variations.join('\n')}
        `;
    }

    generateGenericModel(educationLevel, scienceField, modelType) {
        const title = modelType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        return `
1. Model Title
${title}

2. Objective/Purpose
This ${scienceField} model helps ${educationLevel} students understand fundamental scientific principles through hands-on experimentation and observation.

3. Materials Needed
- Basic craft supplies (paper, cardboard, glue)
- Recyclable materials (plastic bottles, containers)
- Common household items
- Safety equipment (gloves, goggles if needed)
- Decorative materials for presentation

4. Step-by-Step Instructions
1. Research the scientific concept behind ${title}
2. Design your model layout and components
3. Gather all required materials
4. Follow safety guidelines throughout construction
5. Assemble the model step by step
6. Test the functionality
7. Make improvements based on testing
8. Prepare presentation materials

5. Key Scientific Concepts
- Core principles of ${scienceField}
- Scientific method application
- Real-world connections
- Problem-solving techniques

6. Learning Resources
- Science textbooks and encyclopedias
- Educational websites and videos
- Local science museum resources
- Teacher guidance and peer collaboration

7. Enhancement Tips
- Use accurate colors and proportions
- Include interactive elements
- Add detailed labels and explanations
- Incorporate technology where appropriate
- Ensure durability for repeated use

8. Variations/Extensions
- Create different scale versions
- Add digital components (LEDs, sensors)
- Develop companion mobile app
- Build collaborative group projects
- Connect with current scientific research
        `;
    }

    displayResult(content) {
        const modelResult = document.getElementById('modelResult');
        const sections = content.split(/\d\./).filter(section => section.trim());
        
        let html = '';
        const icons = ['🎯', '📚', '🧪', '🔧', '💡', '📖', '🌟', '🔄'];
        
        sections.forEach((section, index) => {
            const lines = section.split('\n').filter(line => line.trim());
            if (lines.length === 0) return;
            
            const title = lines[0].trim();
            const body = lines.slice(1).join('<br>');
            
            html += `
                <div class="result-section" style="animation-delay: ${index * 0.1}s">
                    <h4>${icons[index] || '🔬'} ${title}</h4>
                    <p>${body}</p>
                </div>
            `;
        });
        
        modelResult.innerHTML = html;
    }

    showLoading(show) {
        const loading = document.getElementById('loadingIndicator');
        const result = document.getElementById('modelResult');
        
        if (show) {
            loading.style.display = 'flex';
            result.style.opacity = '0.5';
        } else {
            loading.style.display = 'none';
            result.style.opacity = '1';
        }
    }

    updateStats() {
        this.modelsGenerated++;
        document.getElementById('modelsGenerated').textContent = this.modelsGenerated;
        document.getElementById('apiStatus').textContent = this.apiConnected ? 'Online' : 'Offline';
        document.getElementById('apiStatus').style.color = this.apiConnected ? '#2ecc71' : '#e74c3c';
    }

    async checkApiConnectivity() {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": "deepseek/deepseek-chat-v3.1:free",
                    "messages": [{ "role": "user", "content": "Test" }],
                    "max_tokens": 5
                })
            });
            
            this.apiConnected = response.ok;
        } catch (error) {
            this.apiConnected = false;
        }
        
        this.updateStats();
    }

    exportAsPDF() {
        const modelResult = document.getElementById('modelResult');
        if (!modelResult.innerHTML || modelResult.innerHTML.includes('welcome-message')) {
            this.showNotification('Please generate a model idea first.', 'error');
            return;
        }

        // Simple PDF export implementation
        const content = modelResult.innerText;
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'science-model-idea.pdf';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('PDF exported successfully!', 'success');
    }

    exportAsWord() {
        const modelResult = document.getElementById('modelResult');
        if (!modelResult.innerHTML || modelResult.innerHTML.includes('welcome-message')) {
            this.showNotification('Please generate a model idea first.', 'error');
            return;
        }

        const content = modelResult.innerText;
        const blob = new Blob([content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'science-model-idea.doc';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Word document exported successfully!', 'success');
    }

    shareModel() {
        const modelResult = document.getElementById('modelResult');
        if (!modelResult.innerHTML || modelResult.innerHTML.includes('welcome-message')) {
            this.showNotification('Please generate a model idea first.', 'error');
            return;
        }

        if (navigator.share) {
            navigator.share({
                title: 'Science Model Idea',
                text: modelResult.innerText.substring(0, 100) + '...',
                url: window.location.href
            });
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(modelResult.innerText).then(() => {
                this.showNotification('Model copied to clipboard!', 'success');
            });
        }
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScienceModelGenerator();
});

// Add some interactive animations
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to all interactive elements
    const interactiveElements = document.querySelectorAll('button, select, .feature, .stat-item, .result-section');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add typing animation to welcome message
    const welcomeText = "Welcome to Science Model Generator!";
    const welcomeElement = document.querySelector('.welcome-message h3');
    
    if (welcomeElement) {
        let i = 0;
        welcomeElement.textContent = '';
        
        function typeWriter() {
            if (i < welcomeText.length) {
                welcomeElement.textContent += welcomeText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        typeWriter();
    }
});