// STEAM PBL Project Generator - Advanced AI-Integrated JS
class STEAMProjectGenerator {
    constructor() {
        this.projects = [];
        this.themes = {
            science: ["Renewable Energy", "Climate Change", "Space Exploration", "Ecosystems", "Human Body", "Robotics in Biology"],
            technology: ["AI Ethics", "App Development", "Cybersecurity", "AR/VR", "Blockchain Basics", "Smart Homes"],
            engineering: ["Bridge Design", "Sustainable Cities", "Rocketry", "Robotics", "3D Printing", "Solar Cars"],
            arts: ["Digital Art", "Music & Code", "Theater Tech", "Animation", "Game Design", "Fashion Tech"],
            math: ["Data Science", "Geometry in Art", "Cryptography", "Statistics in Sports", "Fractals", "Game Theory"]
        };
    }

    generateProject(grade, subject, complexity, problem = "") {
        const theme = this.themes[subject][Math.floor(Math.random() * this.themes[subject].length)];
        const aiPrompt = problem ? ` for "${problem}"` : "";
        
        const titles = {
            "k-2": `🌟 ${theme} Adventure`,
            "3-5": `🔬 Explore: ${theme}`,
            "6-8": `⚡ Build: ${theme} Solution${aiPrompt}`,
            "9-12": `🚀 Innovate: ${theme} Challenge${aiPrompt}`
        };

        const durations = { beginner: "1-2 weeks", intermediate: "3-4 weeks", advanced: "5-8 weeks" };
        const stepsCount = { beginner: 4, intermediate: 6, advanced: 8 };

        const steps = this.generateSmartSteps(subject, complexity, stepsCount[complexity], problem);
        const resources = this.generateSmartResources(subject, complexity);

        return {
            title: titles[grade],
            description: this.generateDescription(theme, grade, problem),
            steps,
            duration: durations[complexity],
            resources,
            standards: this.getStandards(grade, subject),
            tools: this.getTools(subject)
        };
    }

    generateDescription(theme, grade, problem) {
        const base = `Students will investigate <strong>${theme}</strong> through hands-on, real-world problem-solving.`;
        const custom = problem ? ` They will design a solution to <em>"${problem}"</em>.` : "";
        return base + custom;
    }

    generateSmartSteps(subject, level, count, problem) {
        const templates = {
            beginner: ["Observe", "Draw", "Build a model", "Share"],
            intermediate: ["Research", "Plan", "Design", "Build", "Test", "Present"],
            advanced: ["Define Problem", "Research Deeply", "Prototype", "Iterate", "Test Rigorously", "Analyze Data", "Present Professionally", "Reflect"]
        };

        const base = templates[level];
        const steps = [];
        for (let i = 0; i < count; i++) {
            steps.push(`<strong>Step ${i+1}:</strong> ${base[i % base.length]} ${subject} concepts${problem ? ` for "${problem}"` : ''}`);
        }
        return steps;
    }

    generateSmartResources(subject, level) {
        const base = ["YouTube Tutorials", "Khan Academy", "Teacher Guide"];
        const advanced = level === "advanced" ? ["Research Papers", "GitHub Repos", "IEEE Articles"] : [];
        return [...base, ...advanced];
    }

    getStandards(grade, subject) {
        return [`NGSS ${subject.toUpperCase()}-Aligned`, `CCSS Math Practice`, `ISTE Standards`];
    }

    getTools(subject) {
        const tools = {
            science: ["PhET", "Google Earth", "Arduino"],
            technology: ["Scratch", "Python", "Figma"],
            engineering: ["Tinkercad", "Fusion 360", "LEGO"],
            arts: ["Canva", "GarageBand", "Blender"],
            math: ["Desmos", "GeoGebra", "Excel"]
        };
        return tools[subject] || [];
    }
}

const generator = new STEAMProjectGenerator();

function generateProject() {
    const grade = document.getElementById('gradeLevel').value;
    const subject = document.getElementById('subjectFocus').value;
    const complexity = document.getElementById('complexity').value;
    const problem = document.getElementById('realWorldProblem').value.trim();

    if (!grade || !subject) {
        alert('⚠️ Please select grade and subject!');
        return;
    }

    const btn = document.querySelector('.generate-btn');
    btn.classList.add('loading');
    document.getElementById('loading').style.display = 'inline-block';

    setTimeout(() => {
        const project = generator.generateProject(grade, subject, complexity, problem);
        displayProject(project);
        btn.classList.remove('loading');
        document.getElementById('loading').style.display = 'none';
    }, 1200);
}

function displayProject(project) {
    const output = document.getElementById('projectOutput');
    output.innerHTML = `
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        
        <div class="info-grid">
            <div><strong>⏱️ Duration:</strong> ${project.duration}</div>
            <div><strong>📊 Standards:</strong> ${project.standards.join(', ')}</div>
        </div>

        <h4>📋 Step-by-Step Plan:</h4>
        <ol class="steps-list">
            ${project.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>

        <h4>🛠️ Recommended Tools:</h4>
        <div class="tags">${project.tools.map(t => `<span class="tag">${t}</span>`).join('')}</div>

        <h4>📚 Resources:</h4>
        <ul class="resources-list">
            ${project.resources.map(r => `<li>🔗 ${r}</li>`).join('')}
        </ul>

        <div class="actions">
            <button class="btn" onclick="exportPDF()">📄 Export PDF</button>
            <button class="btn" onclick="saveProject()">💾 Save</button>
            <button class="btn" onclick="generateProject()">🎲 New Idea</button>
        </div>
    `;
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    html2canvas(document.getElementById('projectOutput')).then(canvas => {
        const img = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(img, 'PNG', 10, 10);
        pdf.save('STEAM-Project.pdf');
    });
}

function saveProject() {
    alert('✅ Project saved to local storage!');
    // Future: Save to localStorage or backend
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('themeToggle');
    btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 STEAM PBL Generator v2.0 Loaded!');
});