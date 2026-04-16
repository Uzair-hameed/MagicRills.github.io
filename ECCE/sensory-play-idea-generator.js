// ==================== DATA STRUCTURES ====================

// Skills Definition
const SENSORY_SKILLS = [
    { id: "S1", name: "Touch Discrimination", indicator: "Differentiates soft/hard/rough textures" },
    { id: "S2", name: "Visual Discrimination", indicator: "Differentiates colors and shapes" },
    { id: "S3", name: "Auditory Discrimination", indicator: "Differentiates loud/soft sounds" },
    { id: "S4", name: "Smell Recognition", indicator: "Recognizes familiar smells (lemon, cinnamon)" },
    { id: "S5", name: "Taste Recognition", indicator: "Differentiates sweet/sour/salty (edible play)" },
    { id: "S6", name: "Temperature Sense", indicator: "Differentiates hot/cold" },
    { id: "S7", name: "Weight Sense", indicator: "Differentiates heavy/light" },
    { id: "S8", name: "Proprioception", indicator: "Controls own strength (doesn't press too hard)" },
    { id: "S9", name: "Vestibular Sense", indicator: "Maintains balance while swinging/spinning" },
    { id: "S10", name: "Multi-sensory Integration", indicator: "Uses 2+ senses simultaneously" }
];

const ACADEMIC_SKILLS = [
    { id: "A1", name: "Color Recognition", indicator: "Identifies red, yellow, blue, green" },
    { id: "A2", name: "Counting (1-10)", indicator: "Counts objects from 1 to 10" },
    { id: "A3", name: "Alphabet (A-F)", indicator: "Recognizes at least 6 letters" },
    { id: "A4", name: "Shape Recognition", indicator: "Identifies circle, square, triangle" },
    { id: "A5", name: "Name Recognition", indicator: "Recognizes own written name" },
    { id: "A6", name: "Number Recognition (1-5)", indicator: "Recognizes written numbers 1-5" },
    { id: "A7", name: "Matching", indicator: "Matches two identical pictures" },
    { id: "A8", name: "Sequencing", indicator: "Arranges small to big" },
    { id: "A9", name: "Opposites", indicator: "Understands big/small, inside/outside" },
    { id: "A10", name: "Following Instructions", indicator: "Follows 2-step instructions" }
];

const ALL_SKILLS = [...SENSORY_SKILLS, ...ACADEMIC_SKILLS];

// Activity Bank for weak skills
const ACTIVITY_BANK = {
    "S1": { activities: ["Texture Walk - Walk on different surfaces", "Mystery Box - Guess objects by touch", "Fabric Match - Match similar textures"], materials: "Fabrics, sandpaper, cotton, sponges", homeTip: "Use different clothes (jeans, silk, towel) at home" },
    "S2": { activities: ["Color Sorting - Sort colored objects", "Pattern Match - Complete the pattern", "I Spy - Find objects of specific color"], materials: "Colored blocks, beads, papers", homeTip: "Ask child to find red/yellow/blue things at home" },
    "S3": { activities: ["Sound Shakers - Guess the sound", "Animal Sounds - Match sound to animal", "Loud/Soft Game - Respond to volume changes"], materials: "Shakers, bells, drums", homeTip: "Play 'What sound is this?' with household items" },
    "S4": { activities: ["Smell Jars - Identify different smells", "Nature Walk - Smell flowers and leaves", "Spice Exploration - Smell kitchen spices"], materials: "Lemon, cinnamon, vanilla, coffee", homeTip: "Let them smell fruits before eating" },
    "S5": { activities: ["Taste Test - Sweet/sour/salty identification", "Blind Taste - Guess with eyes closed", "Food Pairing - Match tastes to foods"], materials: "Sugar, lemon, salt, apple", homeTip: "Talk about tastes during meals" },
    "S6": { activities: ["Hot/Cold Water Play", "Ice Cube Exploration", "Warm/Cold Pack Sorting"], materials: "Water, ice cubes, warm pack", homeTip: "Let them feel warm/cold food safely" },
    "S7": { activities: ["Heavy/Light Boxes - Lift and compare", "Balance Scale - Compare weights", "Fill the Container - Feel weight changes"], materials: "Containers, rice, beans, cotton", homeTip: "Compare full vs empty water bottles" },
    "S8": { activities: ["Play Dough Press - Different pressure levels", "Bottle Cap Twist - Open/close various lids", "Scoop and Transfer - Use different forces"], materials: "Play dough, bottles, scoops", homeTip: "Let them knead dough or open jars" },
    "S9": { activities: ["Balance Beam - Walk on line", "Spinning Game - Spin and stop", "Rocking Chair - Gentle rocking"], materials: "Tape for line, chair", homeTip: "Play gentle swinging games" },
    "S10": { activities: ["Sensory Bin Exploration", "Music and Movement", "Art with Music"], materials: "Sensory bin, music player", homeTip: "Combine listening with touching activities" },
    "A1": { activities: ["Color Hunt - Find colors in room", "Color Sorting - Sort objects by color", "Color Match - Match colored cards"], materials: "Colored cards, toys", homeTip: "Name colors of fruits and vegetables" },
    "A2": { activities: ["Count the Objects", "Number Song - Sing counting rhymes", "Finger Counting"], materials: "Counters, blocks", homeTip: "Count stairs, spoons, fruits daily" },
    "A3": { activities: ["Sand Tray Writing - Write letters in sand", "Letter Hunt - Find A,B,C in classroom", "Letter Song - Sing alphabet song"], materials: "Sand tray, letter cards", homeTip: "Write letters on flour/semolina" },
    "A4": { activities: ["Shape Sorting - Sort by shape", "Shape Hunt - Find shapes in room", "Play Dough Shapes - Make shapes"], materials: "Shape blocks, play dough", homeTip: "Point to round/square things at home" },
    "A5": { activities: ["Name Card Match - Match name to picture", "Name Tracing - Trace own name", "Name Puzzle - Arrange name letters"], materials: "Name cards, sand tray", homeTip: "Display child's name on their things" },
    "A6": { activities: ["Number Match - Match number to quantity", "Number Hunt - Find numbers 1-5", "Dot to Dot - Connect numbers"], materials: "Number cards, counters", homeTip: "Point to house/phone numbers" },
    "A7": { activities: ["Memory Match - Match pairs", "Object to Picture Match", "Same/Different Game"], materials: "Matching cards, objects", homeTip: "Match socks or shoes at home" },
    "A8": { activities: ["Size Sort - Small to big", "Story Sequence - Arrange picture order", "Number Line - Arrange numbers"], materials: "Size varied objects, picture cards", homeTip: "Arrange spoons by size" },
    "A9": { activities: ["Opposite Cards - Match opposites", "Inside/Outside Game", "Big/Small Sort"], materials: "Opposite cards, boxes", homeTip: "Use 'in/out', 'up/down' in daily talk" },
    "A10": { activities: ["Two-Step Commands - First X then Y", "Simon Says Game", "Obstacle Course with steps"], materials: "None", homeTip: "Give simple two-step instructions at home" }
};

// Storage Keys
const STORAGE_KEYS = {
    STUDENTS: "sensory_students",
    CLASS_NAME: "sensory_class_name",
    CHECKLISTS: "sensory_checklists",
    TOTAL_USAGE: "sensory_total_usage"
};

// Global Variables
let students = [];
let currentChecklistData = {};
let analysisData = null;
let classChart = null;
let skillsChart = null;

// ==================== TOAST NOTIFICATIONS ====================

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";
    
    toast.innerHTML = `${icon} ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = "slideIn 0.3s ease reverse";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== SCROLL BUTTONS ====================

function setupScrollButtons() {
    const scrollUpBtn = document.getElementById("scrollUpBtn");
    const scrollDownBtn = document.getElementById("scrollDownBtn");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            scrollUpBtn.classList.add("show");
        } else {
            scrollUpBtn.classList.remove("show");
        }
    });
    
    scrollUpBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        showToast("Scrolled to top", "info");
    });
    
    scrollDownBtn.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        showToast("Scrolled to bottom", "info");
    });
}

// ==================== PAGE SHARE ====================

function setupPageShare() {
    const shareBtn = document.getElementById("sharePageBtn");
    
    shareBtn.addEventListener("click", async () => {
        const url = window.location.href;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Sensory Play Tracker",
                    text: "Check out this amazing ECCE teacher tool!",
                    url: url
                });
                incrementShareCount();
                showToast("Page shared successfully!", "success");
            } catch (err) {
                copyToClipboard(url);
            }
        } else {
            copyToClipboard(url);
        }
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        incrementShareCount();
        showToast("Link copied to clipboard!", "success");
    }).catch(() => {
        showToast("Failed to copy link", "error");
    });
}

let shareCount = 0;
function incrementShareCount() {
    shareCount++;
    let total = localStorage.getItem("total_shares") || 0;
    total++;
    localStorage.setItem("total_shares", total);
}

// ==================== USAGE COUNTER ====================

function incrementTotalUsage() {
    let total = localStorage.getItem(STORAGE_KEYS.TOTAL_USAGE) || 0;
    total++;
    localStorage.setItem(STORAGE_KEYS.TOTAL_USAGE, total);
    document.getElementById("totalUsageCount").innerText = total;
    showToast("Tool usage recorded!", "success");
}

function loadTotalUsage() {
    let total = localStorage.getItem(STORAGE_KEYS.TOTAL_USAGE) || 0;
    document.getElementById("totalUsageCount").innerText = total;
}

// ==================== INITIALIZATION ====================

function loadData() {
    const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
    
    const savedClass = localStorage.getItem(STORAGE_KEYS.CLASS_NAME);
    if (savedClass) {
        document.getElementById('className').value = savedClass;
    }
    
    renderStudentsList();
    loadTotalUsage();
}

function saveStudents() {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    renderStudentsList();
}

// ==================== TAB MANAGEMENT ====================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        incrementTotalUsage();
    });
});

// ==================== TAB 1: STUDENT PROFILES ====================

function renderStudentsList() {
    const container = document.getElementById('studentsList');
    if (!container) return;
    
    if (students.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:gray;">No students added yet. Add your first student above.</p>';
        return;
    }
    
    container.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-info">
                <h4>${escapeHtml(student.name)}</h4>
                <p>Roll No: ${student.rollNo} | WhatsApp: ${student.whatsapp}</p>
            </div>
            <div class="student-actions">
                <button class="icon-btn edit" onclick="editStudent('${student.id}')">✏️</button>
                <button class="icon-btn delete" onclick="deleteStudent('${student.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    const rollNo = document.getElementById('studentRollNo').value.trim();
    const whatsapp = document.getElementById('studentWhatsapp').value.trim();
    
    if (!name || !rollNo) {
        showToast("Please enter student name and roll number", "error");
        return;
    }
    
    const newStudent = {
        id: Date.now().toString(),
        name: name,
        rollNo: rollNo,
        whatsapp: whatsapp || 'Not provided'
    };
    
    students.push(newStudent);
    saveStudents();
    
    document.getElementById('studentName').value = '';
    document.getElementById('studentRollNo').value = '';
    document.getElementById('studentWhatsapp').value = '';
    
    showToast(`Student ${name} added successfully!`, "success");
}

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    const newName = prompt('Edit Student Name:', student.name);
    const newRollNo = prompt('Edit Roll Number:', student.rollNo);
    const newWhatsapp = prompt('Edit WhatsApp Number:', student.whatsapp);
    
    if (newName) student.name = newName;
    if (newRollNo) student.rollNo = newRollNo;
    if (newWhatsapp) student.whatsapp = newWhatsapp;
    
    saveStudents();
    showToast("Student updated successfully!", "success");
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== id);
        saveStudents();
        showToast("Student deleted successfully!", "success");
    }
}

function saveClassName() {
    const className = document.getElementById('className').value;
    localStorage.setItem(STORAGE_KEYS.CLASS_NAME, className);
    showToast("Class name saved!", "success");
}

function exportStudents() {
    const data = {
        students: students,
        className: localStorage.getItem(STORAGE_KEYS.CLASS_NAME)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sensory_students_backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast("Students exported successfully!", "success");
}

function importStudents() {
    document.getElementById('importFileInput').click();
}

document.getElementById('importFileInput')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.students) students = data.students;
            if (data.className) document.getElementById('className').value = data.className;
            saveStudents();
            showToast("Import successful!", "success");
        } catch (err) {
            showToast("Invalid file format", "error");
        }
    };
    reader.readAsText(file);
});

// ==================== TAB 2: DAILY CHECKLIST ====================

function renderChecklist() {
    const date = document.getElementById('checklistDate').value;
    if (!date) {
        document.getElementById('checklistDate').value = new Date().toISOString().split('T')[0];
    }
    loadChecklistForDate();
}

function loadChecklistForDate() {
    const date = document.getElementById('checklistDate').value;
    if (!date) return;
    
    const savedData = localStorage.getItem(`${STORAGE_KEYS.CHECKLISTS}_${date}`);
    if (savedData) {
        currentChecklistData = JSON.parse(savedData);
    } else {
        currentChecklistData = {};
        students.forEach(student => {
            currentChecklistData[student.id] = {
                present: true,
                skills: {}
            };
            ALL_SKILLS.forEach(skill => {
                currentChecklistData[student.id].skills[skill.id] = 0;
            });
        });
    }
    
    renderChecklistUI();
}

function renderChecklistUI() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;
    
    if (students.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:gray;">No students found. Please add students in Tab 1 first.</p>';
        return;
    }
    
    container.innerHTML = students.map(student => {
        const studentData = currentChecklistData[student.id] || { present: true, skills: {} };
        
        return `
            <div class="checklist-student">
                <div class="checklist-header">
                    <h4>${escapeHtml(student.name)} (Roll: ${student.rollNo})</h4>
                    <div class="attendance-badge">
                        <label>
                            <input type="checkbox" class="attendance-check" data-id="${student.id}" ${studentData.present ? 'checked' : ''}>
                            ✅ Present
                        </label>
                    </div>
                </div>
                <div class="skills-grid">
                    ${ALL_SKILLS.map(skill => `
                        <div class="skill-item">
                            <span class="skill-name" title="${skill.indicator}">${skill.id}: ${skill.name}</span>
                            <div class="skill-buttons">
                                <button class="skill-btn yes ${studentData.skills[skill.id] === 1 ? 'active-yes' : ''}" data-student="${student.id}" data-skill="${skill.id}" data-value="1">✓ 1</button>
                                <button class="skill-btn no ${studentData.skills[skill.id] === 0 ? 'active-no' : ''}" data-student="${student.id}" data-skill="${skill.id}" data-value="0">✗ 0</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    // Attach event listeners
    document.querySelectorAll('.attendance-check').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const studentId = e.target.dataset.id;
            if (currentChecklistData[studentId]) {
                currentChecklistData[studentId].present = e.target.checked;
                showToast(`Attendance updated for ${studentId}`, "info");
            }
        });
    });
    
    document.querySelectorAll('.skill-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const studentId = btn.dataset.student;
            const skillId = btn.dataset.skill;
            const value = parseInt(btn.dataset.value);
            
            if (currentChecklistData[studentId]) {
                currentChecklistData[studentId].skills[skillId] = value;
            }
            
            // Update UI
            const parent = btn.parentElement;
            parent.querySelectorAll('.skill-btn').forEach(b => {
                b.classList.remove('active-yes', 'active-no');
            });
            btn.classList.add(value === 1 ? 'active-yes' : 'active-no');
            showToast(`Skill ${skillId} marked as ${value === 1 ? "Achieved" : "Not Achieved"}`, "info");
        });
    });
}

function saveChecklist() {
    const date = document.getElementById('checklistDate').value;
    if (!date) {
        showToast("Please select a date", "error");
        return;
    }
    
    localStorage.setItem(`${STORAGE_KEYS.CHECKLISTS}_${date}`, JSON.stringify(currentChecklistData));
    showToast(`Checklist saved for ${date}!`, "success");
}

function exportToTxt() {
    const date = document.getElementById('checklistDate').value;
    if (!date) {
        showToast("Please select a date", "error");
        return;
    }
    
    let content = `SENSORY PLAY CHECKLIST\n`;
    content += `Date: ${date}\n`;
    content += `Class: ${localStorage.getItem(STORAGE_KEYS.CLASS_NAME) || 'Not set'}\n`;
    content += `Total Students: ${students.length}\n`;
    content += `Present Students: ${Object.values(currentChecklistData).filter(d => d.present).length}\n`;
    content += `\n${'='.repeat(60)}\n\n`;
    
    students.forEach(student => {
        const data = currentChecklistData[student.id];
        if (!data) return;
        
        content += `Student: ${student.name} (${student.rollNo})\n`;
        content += `Attendance: ${data.present ? 'PRESENT' : 'ABSENT'}\n`;
        
        if (data.present) {
            const sensoryScores = [];
            const academicScores = [];
            
            SENSORY_SKILLS.forEach(skill => {
                const val = data.skills[skill.id] || 0;
                sensoryScores.push(val);
                content += `  ${skill.id}: ${skill.name} → ${val}\n`;
            });
            
            ACADEMIC_SKILLS.forEach(skill => {
                const val = data.skills[skill.id] || 0;
                academicScores.push(val);
                content += `  ${skill.id}: ${skill.name} → ${val}\n`;
            });
            
            const sensoryTotal = sensoryScores.reduce((a,b) => a+b, 0);
            const academicTotal = academicScores.reduce((a,b) => a+b, 0);
            content += `  Sensory Total: ${sensoryTotal}/${SENSORY_SKILLS.length}\n`;
            content += `  Academic Total: ${academicTotal}/${ACADEMIC_SKILLS.length}\n`;
        }
        content += `\n${'-'.repeat(40)}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensory_checklist_${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported successfully!", "success");
}

// ==================== TAB 3: ANALYSIS & REPORTS ====================

function analyzeFiles(files) {
    showToast("Analyzing files...", "info");
    
    const filePromises = Array.from(files).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ name: file.name, content: e.target.result });
            reader.readAsText(file);
        });
    });
    
    Promise.all(filePromises).then(results => {
        const weeklyData = {};
        
        results.forEach(result => {
            const content = result.content;
            const lines = content.split('\n');
            
            let currentStudent = null;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.startsWith('Student:')) {
                    const match = line.match(/Student: (.+?) \(/);
                    if (match) {
                        const studentName = match[1];
                        const student = students.find(s => s.name === studentName);
                        if (student) {
                            currentStudent = student.id;
                            if (!weeklyData[currentStudent]) {
                                weeklyData[currentStudent] = {
                                    student: student,
                                    daysCount: 0,
                                    sensoryScores: {},
                                    academicScores: {}
                                };
                                ALL_SKILLS.forEach(s => {
                                    weeklyData[currentStudent].sensoryScores[s.id] = 0;
                                    weeklyData[currentStudent].academicScores[s.id] = 0;
                                });
                            }
                        }
                    }
                }
                
                if (line.match(/S[0-9]+:/) && currentStudent) {
                    const skillMatch = line.match(/(S[0-9]+):.+?→ ([01])/);
                    if (skillMatch) {
                        const skillId = skillMatch[1];
                        const value = parseInt(skillMatch[2]);
                        if (weeklyData[currentStudent]) {
                            weeklyData[currentStudent].sensoryScores[skillId] += value;
                        }
                    }
                }
                
                if (line.match(/A[0-9]+:/) && currentStudent) {
                    const skillMatch = line.match(/(A[0-9]+):.+?→ ([01])/);
                    if (skillMatch) {
                        const skillId = skillMatch[1];
                        const value = parseInt(skillMatch[2]);
                        if (weeklyData[currentStudent]) {
                            weeklyData[currentStudent].academicScores[skillId] += value;
                        }
                    }
                }
            }
        });
        
        // Calculate percentages
        Object.keys(weeklyData).forEach(studentId => {
            const data = weeklyData[studentId];
            data.daysCount = results.length;
            
            Object.keys(data.sensoryScores).forEach(skillId => {
                data.sensoryScores[skillId] = Math.round((data.sensoryScores[skillId] / results.length) * 100);
            });
            
            Object.keys(data.academicScores).forEach(skillId => {
                data.academicScores[skillId] = Math.round((data.academicScores[skillId] / results.length) * 100);
            });
        });
        
        analysisData = weeklyData;
        renderAnalysisReports(weeklyData, results.length);
        showToast("Analysis complete!", "success");
    });
}

function renderAnalysisReports(data, totalDays) {
    const summaryDiv = document.getElementById('analysisSummary');
    const reportsDiv = document.getElementById('individualReports');
    const heroDiv = document.getElementById('heroOfWeek');
    
    // Summary
    const studentScores = Object.values(data).map(d => ({
        name: d.student.name,
        sensoryAvg: Object.values(d.sensoryScores).reduce((a,b) => a+b, 0) / SENSORY_SKILLS.length,
        academicAvg: Object.values(d.academicScores).reduce((a,b) => a+b, 0) / ACADEMIC_SKILLS.length,
        totalAvg: (Object.values(d.sensoryScores).reduce((a,b) => a+b, 0) + Object.values(d.academicScores).reduce((a,b) => a+b, 0)) / (SENSORY_SKILLS.length + ACADEMIC_SKILLS.length)
    }));
    
    const classAvg = studentScores.reduce((a,b) => a + b.totalAvg, 0) / studentScores.length;
    
    summaryDiv.innerHTML = `
        <div class="report-card">
            <h3>📊 Weekly Summary</h3>
            <p>Total Days Analyzed: ${totalDays}</p>
            <p>Total Students: ${Object.keys(data).length}</p>
            <p>Class Average Score: ${classAvg.toFixed(1)}%</p>
            <p>Top Performing Student: ${studentScores.sort((a,b) => b.totalAvg - a.totalAvg)[0]?.name || 'N/A'}</p>
        </div>
    `;
    
    // Charts
    const classLabels = studentScores.map(s => s.name);
    const classScores = studentScores.map(s => s.totalAvg);
    
    if (classChart) classChart.destroy();
    if (skillsChart) skillsChart.destroy();
    
    const ctx1 = document.getElementById('classChart').getContext('2d');
    classChart = new Chart(ctx1, {
        type: 'bar',
        data: { labels: classLabels, datasets: [{ label: 'Overall Score %', data: classScores, backgroundColor: '#FF7700' }] },
        options: { responsive: true, scales: { y: { max: 100 } } }
    });
    
    // Skill-wise chart
    const skillAverages = {};
    ALL_SKILLS.forEach(skill => {
        let total = 0;
        let count = 0;
        Object.values(data).forEach(studentData => {
            if (skill.id.startsWith('S')) {
                total += studentData.sensoryScores[skill.id] || 0;
            } else {
                total += studentData.academicScores[skill.id] || 0;
            }
            count++;
        });
        skillAverages[skill.id] = total / count;
    });
    
    const ctx2 = document.getElementById('skillsChart').getContext('2d');
    skillsChart = new Chart(ctx2, {
        type: 'radar',
        data: { labels: ALL_SKILLS.map(s => `${s.id}:${s.name.substring(0,10)}`), datasets: [{ label: 'Class Average %', data: ALL_SKILLS.map(s => skillAverages[s.id]), backgroundColor: 'rgba(255,119,0,0.2)', borderColor: '#FF7700' }] },
        options: { responsive: true, scales: { r: { max: 100 } } }
    });
    
    // Individual Reports
    reportsDiv.innerHTML = Object.values(data).map(studentData => {
        const weakSkills = [];
        const nextFocus = [];
        
        ALL_SKILLS.forEach(skill => {
            const score = skill.id.startsWith('S') ? studentData.sensoryScores[skill.id] : studentData.academicScores[skill.id];
            if (score < 60) {
                weakSkills.push({ skill, score });
            }
        });
        
        weakSkills.sort((a,b) => a.score - b.score);
        const topWeak = weakSkills.slice(0, 3);
        
        return `
            <div class="report-card">
                <h3>📄 ${escapeHtml(studentData.student.name)} (Roll: ${studentData.student.rollNo})</h3>
                <p><strong>Sensory Skills Average:</strong> ${(Object.values(studentData.sensoryScores).reduce((a,b)=>a+b,0)/SENSORY_SKILLS.length).toFixed(1)}%</p>
                <p><strong>Academic Skills Average:</strong> ${(Object.values(studentData.academicScores).reduce((a,b)=>a+b,0)/ACADEMIC_SKILLS.length).toFixed(1)}%</p>
                <p><strong>Overall Score:</strong> ${((Object.values(studentData.sensoryScores).reduce((a,b)=>a+b,0) + Object.values(studentData.academicScores).reduce((a,b)=>a+b,0)) / (SENSORY_SKILLS.length + ACADEMIC_SKILLS.length)).toFixed(1)}%</p>
                
                ${topWeak.length > 0 ? `
                    <div class="weak-skills">
                        <strong>⚠️ Weak Skills (Need Improvement):</strong>
                        ${topWeak.map(w => `<div>${w.skill.id}: ${w.skill.name} - ${w.score}%</div>`).join('')}
                    </div>
                    <div class="next-focus">
                        <strong>🎯 Next Week Focus:</strong>
                        ${topWeak.map(w => `<div>➜ ${w.skill.id}: ${w.skill.name} - ${ACTIVITY_BANK[w.skill.id]?.activities[0] || 'Practice at home'}</div>`).join('')}
                    </div>
                ` : '<div class="next-focus"><strong>🎉 Excellent! All skills above 60%</strong></div>'}
                
                ${Object.entries(studentData.sensoryScores).map(([id, score]) => `
                    <div class="skill-progress">
                        <span>${id}: ${SENSORY_SKILLS.find(s=>s.id===id)?.name || id}</span>
                        <div class="progress-bar"><div class="progress-fill" style="width:${score}%"></div></div>
                    </div>
                `).join('')}
                
                ${Object.entries(studentData.academicScores).map(([id, score]) => `
                    <div class="skill-progress">
                        <span>${id}: ${ACADEMIC_SKILLS.find(s=>s.id===id)?.name || id}</span>
                        <div class="progress-bar"><div class="progress-fill" style="width:${score}%"></div></div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
    
    // Hero of the Week
    const hero = studentScores.sort((a,b) => b.totalAvg - a.totalAvg)[0];
    if (hero) {
        heroDiv.innerHTML = `
            <div class="hero-card">
                <h2>🏆 Hero of the Week 🏆</h2>
                <h3>⭐ ${escapeHtml(hero.name)} ⭐</h3>
                <p>Sensory: ${hero.sensoryAvg.toFixed(1)}% | Academic: ${hero.academicAvg.toFixed(1)}% | Overall: ${hero.totalAvg.toFixed(1)}%</p>
                <p>🎉 Congratulations! Keep up the great work! 🎉</p>
            </div>
        `;
    }
    
    // Save for Teacher Action Plan
    generateTeacherActionPlan(data);
}

function generateTeacherActionPlan(data) {
    // Calculate class-wide weak skills
    const skillWeakCount = {};
    ALL_SKILLS.forEach(skill => { skillWeakCount[skill.id] = 0; });
    
    Object.values(data).forEach(studentData => {
        ALL_SKILLS.forEach(skill => {
            const score = skill.id.startsWith('S') ? studentData.sensoryScores[skill.id] : studentData.academicScores[skill.id];
            if (score < 60) skillWeakCount[skill.id]++;
        });
    });
    
    const topClassWeak = ALL_SKILLS.filter(skill => skillWeakCount[skill.id] > 0)
        .sort((a,b) => skillWeakCount[b.id] - skillWeakCount[a.id])
        .slice(0, 4);
    
    const actionPlanHTML = `
        <div class="report-card">
            <h3>👩‍🏫 Teacher Action Plan - Next Week</h3>
            <p>Based on analysis of ${Object.keys(data).length} students</p>
            
            <h4>🎯 Class Priority Skills:</h4>
            ${topClassWeak.map(skill => `
                <div class="activity-item">
                    <strong>${skill.id}: ${skill.name}</strong>
                    <p>📌 ${skill.indicator}</p>
                    <p>🎲 Activities: ${ACTIVITY_BANK[skill.id]?.activities.join(' | ') || 'Use sensory play activities'}</p>
                    <p>🧰 Materials: ${ACTIVITY_BANK[skill.id]?.materials || 'Common classroom items'}</p>
                    <p>🏠 Home Tip: ${ACTIVITY_BANK[skill.id]?.homeTip || 'Practice with everyday objects'}</p>
                </div>
            `).join('')}
            
            <h4>📅 Daily Focus Schedule:</h4>
            <div class="activity-item">
                <strong>Monday:</strong> ${topClassWeak[0]?.id || 'Review'} - ${topClassWeak[0]?.name || 'All skills'}
            </div>
            <div class="activity-item">
                <strong>Tuesday:</strong> ${topClassWeak[1]?.id || 'Review'} - ${topClassWeak[1]?.name || 'All skills'}
            </div>
            <div class="activity-item">
                <strong>Wednesday:</strong> ${topClassWeak[2]?.id || 'Review'} - ${topClassWeak[2]?.name || 'All skills'}
            </div>
            <div class="activity-item">
                <strong>Thursday:</strong> ${topClassWeak[3]?.id || 'Review'} - ${topClassWeak[3]?.name || 'All skills'}
            </div>
            <div class="activity-item">
                <strong>Friday:</strong> Mixed Practice - Review all weak skills
            </div>
        </div>
    `;
    
    const actionContainer = document.getElementById('actionPlanContainer');
    if (actionContainer) actionContainer.innerHTML = actionPlanHTML;
}

// ==================== TAB 4: SEND TO PARENTS ====================

function renderParentList() {
    const container = document.getElementById('parentList');
    if (!container) return;
    
    if (!analysisData) {
        container.innerHTML = '<p style="text-align:center; color:gray;">Please analyze data in Tab 3 first.</p>';
        return;
    }
    
    container.innerHTML = Object.values(analysisData).map(studentData => {
        const sensoryAvg = Object.values(studentData.sensoryScores).reduce((a,b)=>a+b,0) / SENSORY_SKILLS.length;
        const academicAvg = Object.values(studentData.academicScores).reduce((a,b)=>a+b,0) / ACADEMIC_SKILLS.length;
        const overall = (sensoryAvg + academicAvg) / 2;
        
        const weakSkills = [];
        ALL_SKILLS.forEach(skill => {
            const score = skill.id.startsWith('S') ? studentData.sensoryScores[skill.id] : studentData.academicScores[skill.id];
            if (score < 60) weakSkills.push(`${skill.id}: ${skill.name}`);
        });
        
        const message = `Hello! Here is ${studentData.student.name}'s weekly report:\n\nOverall: ${overall.toFixed(1)}%\nSensory: ${sensoryAvg.toFixed(1)}%\nAcademic: ${academicAvg.toFixed(1)}%\n\nWeak areas: ${weakSkills.slice(0,3).join(', ') || 'None! Great job!'}\n\nNext week focus: ${weakSkills.slice(0,3).map(s => s.split(':')[0]).join(', ') || 'Maintain current level'}\n\n- Sensory Play Tracker`;
        
        const whatsappUrl = studentData.student.whatsapp !== 'Not provided' 
            ? `https://wa.me/${studentData.student.whatsapp}?text=${encodeURIComponent(message)}`
            : '#';
        
        return `
            <div class="parent-item">
                <div>
                    <strong>${escapeHtml(studentData.student.name)}</strong><br>
                    <small>${studentData.student.whatsapp}</small>
                </div>
                ${studentData.student.whatsapp !== 'Not provided' 
                    ? `<a href="${whatsappUrl}" target="_blank" class="btn btn-outline" style="padding:8px 15px;" onclick="showToast('Opening WhatsApp...', 'info')">📱 Send on WhatsApp</a>`
                    : '<span style="color:gray;">No WhatsApp number</span>'}
            </div>
        `;
    }).join('');
}

function sendToAllParents() {
    if (!analysisData) {
        showToast("Please analyze data in Tab 3 first.", "error");
        return;
    }
    
    let count = 0;
    Object.values(analysisData).forEach(studentData => {
        if (studentData.student.whatsapp !== 'Not provided') {
            const sensoryAvg = Object.values(studentData.sensoryScores).reduce((a,b)=>a+b,0) / SENSORY_SKILLS.length;
            const academicAvg = Object.values(studentData.academicScores).reduce((a,b)=>a+b,0) / ACADEMIC_SKILLS.length;
            const overall = (sensoryAvg + academicAvg) / 2;
            
            const message = `Hello! Here is ${studentData.student.name}'s weekly report:\n\nOverall: ${overall.toFixed(1)}%\nSensory: ${sensoryAvg.toFixed(1)}%\nAcademic: ${academicAvg.toFixed(1)}%\n\n- Sensory Play Tracker`;
            const url = `https://wa.me/${studentData.student.whatsapp}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
            count++;
        }
    });
    
    showToast(`Opened WhatsApp for ${count} parents. Please send each message manually.`, "success");
}

// ==================== UTILITIES ====================

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function printActionPlan() {
    const content = document.getElementById('actionPlanContainer').innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
        <html><head><title>Teacher Action Plan</title>
        <style>body{font-family:Arial;padding:20px;} .report-card{border:1px solid #ddd;padding:15px;margin-bottom:15px;}</style>
        </head><body>${content}</body></html>
    `);
    win.print();
    showToast("Printing action plan...", "info");
}

// ==================== EVENT LISTENERS ====================

document.getElementById('addStudentBtn')?.addEventListener('click', addStudent);
document.getElementById('saveClassBtn')?.addEventListener('click', saveClassName);
document.getElementById('exportStudentsBtn')?.addEventListener('click', exportStudents);
document.getElementById('importStudentsBtn')?.addEventListener('click', importStudents);
document.getElementById('loadChecklistBtn')?.addEventListener('click', loadChecklistForDate);
document.getElementById('saveChecklistBtn')?.addEventListener('click', saveChecklist);
document.getElementById('exportTxtBtn')?.addEventListener('click', exportToTxt);
document.getElementById('analyzeBtn')?.addEventListener('click', () => {
    const files = document.getElementById('fileUpload').files;
    if (files.length === 0) {
        showToast("Please select TXT files to analyze", "error");
        return;
    }
    analyzeFiles(files);
});
document.getElementById('resetAnalysisBtn')?.addEventListener('click', () => {
    analysisData = null;
    document.getElementById('analysisSummary').innerHTML = '';
    document.getElementById('individualReports').innerHTML = '';
    document.getElementById('heroOfWeek').innerHTML = '';
    if (classChart) classChart.destroy();
    if (skillsChart) skillsChart.destroy();
    showToast("Analysis cleared!", "info");
});
document.getElementById('sendAllBtn')?.addEventListener('click', sendToAllParents);
document.getElementById('printActionPlanBtn')?.addEventListener('click', printActionPlan);

// Initialize all features
loadData();
setupScrollButtons();
setupPageShare();
document.getElementById('checklistDate').value = new Date().toISOString().split('T')[0];
loadChecklistForDate();
renderParentList();

showToast("Welcome to Sensory Play Tracker! 👋", "success");
