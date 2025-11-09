// Main JavaScript for Advanced Auto Timetable Generator Tool

// Data models based on the provided scheme of studies
const subjectsData = {
    grade3: [
        { name: "Sindhi/Urdu", periods: 7, areas: ["Listening", "Speaking", "Reading", "Writing"], medium: "Sindhi/Urdu" },
        { name: "Asan Sindhi/Urdu Salees", periods: 3, medium: "Sindhi/Urdu" },
        { name: "English", periods: 6, areas: ["Listening", "Speaking", "Reading", "Writing"], medium: "English" },
        { name: "Mathematics", periods: 6, medium: "Sindhi/Urdu/English" },
        { name: "General Knowledge", periods: 5, medium: "Sindhi/Urdu/English" },
        { name: "Islamiyat and Nazra Quran", periods: 4, medium: "Sindhi/Urdu" },
        { name: "Library/Reading", periods: 1, medium: "" },
        { name: "Physical Education", periods: 2, medium: "" },
        { name: "Arts and Crafts", periods: 1, medium: "" },
        { name: "ICT", periods: 1, medium: "" }
    ],
    grade4: [
        { name: "Sindhi/Urdu", periods: 6, areas: ["Listening", "Speaking", "Reading", "Writing"], medium: "Sindhi/Urdu" },
        { name: "Asan Sindhi/Urdu", periods: 3, medium: "Sindhi/Urdu" },
        { name: "English", periods: 6, areas: ["Listening", "Speaking", "Reading", "Writing"], medium: "English" },
        { name: "Mathematics", periods: 6, medium: "Sindhi/Urdu/English" },
        { name: "Science", periods: 6, medium: "Sindhi/Urdu/English" },
        { name: "Islamiyat and Nazra Quran", periods: 4, medium: "Sindhi/Urdu" },
        { name: "Social Studies", periods: 5, medium: "Sindhi/Urdu/English" },
        { name: "Library/Reading", periods: 1, medium: "" },
        { name: "Physical Education", periods: 2, medium: "" },
        { name: "Arts and Crafts", periods: 1, medium: "" },
        { name: "ICT", periods: 1, medium: "" }
    ],
    grade5: [
        { name: "Sindhi/Urdu", periods: 6, areas: ["Listening", "Speaking", "Reading", "Writing"], medium: "Sindhi/Urdu" },
        { name: "Asan Sindhi/Urdu", periods: 3, medium: "Sindhi/Urdu" },
        { name: "English", periods: 6, areas: ["Listening", "Speaking", "Reading", "Writing"], medium: "English" },
        { name: "Mathematics", periods: 6, medium: "Sindhi/Urdu/English" },
        { name: "Science", periods: 6, medium: "Sindhi/Urdu/English" },
        { name: "Islamiyat and Nazra Quran", periods: 4, medium: "Sindhi/Urdu" },
        { name: "Social Studies", periods: 5, medium: "Sindhi/Urdu/English" },
        { name: "Library/Reading", periods: 1, medium: "" },
        { name: "Physical Education", periods: 2, medium: "" },
        { name: "Arts and Crafts", periods: 1, medium: "" },
        { name: "ICT", periods: 1, medium: "" }
    ]
};

const teachersData = [
    { id: "teacher1", name: "Ms. Aisha", subject: "Sindhi/Urdu", grade: "all" },
    { id: "teacher2", name: "Mr. Ahmed", subject: "English", grade: "all" },
    { id: "teacher3", name: "Ms. Fatima", subject: "Mathematics", grade: "all" },
    { id: "teacher4", name: "Mr. Hassan", subject: "Science", grade: "all" },
    { id: "teacher5", name: "Ms. Zainab", subject: "Social Studies", grade: "all" },
    { id: "teacher6", name: "Mr. Ibrahim", subject: "Islamiyat and Nazra Quran", grade: "all" },
    { id: "teacher7", name: "Ms. Hina", subject: "Asan Sindhi/Urdu", grade: "all" },
    { id: "teacher8", name: "Mr. Usman", subject: "Physical Education", grade: "all" },
    { id: "teacher9", name: "Ms. Sana", subject: "Arts and Crafts", grade: "all" },
    { id: "teacher10", name: "Mr. Bilal", subject: "ICT", grade: "all" },
    { id: "teacher11", name: "Ms. Rabia", subject: "Library/Reading", grade: "all" }
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

// Color coding for subjects
const subjectColors = {
    "Sindhi/Urdu": "#3498db",
    "Asan Sindhi/Urdu": "#2980b9",
    "English": "#2ecc71",
    "Mathematics": "#e74c3c",
    "General Knowledge": "#9b59b6",
    "Science": "#f39c12",
    "Islamiyat and Nazra Quran": "#1abc9c",
    "Social Studies": "#d35400",
    "Library/Reading": "#34495e",
    "Physical Education": "#27ae60",
    "Arts and Crafts": "#8e44ad",
    "ICT": "#16a085"
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeEventListeners();
    generateAllTimetables('grade3');
});

// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
        themeToggle.innerHTML = '<span class="theme-icon">☀️</span> Light Mode';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        if (isDark) {
            themeIcon.textContent = '☀️';
            themeToggle.innerHTML = '<span class="theme-icon">☀️</span> Light Mode';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.textContent = '🌙';
            themeToggle.innerHTML = '<span class="theme-icon">🌙</span> Dark Mode';
            localStorage.setItem('theme', 'light');
        }
    });
}

// Navigation management
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the target section
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Special handling for certain sections
            if (targetId === 'dashboard-view') {
                updateDashboardStats();
            }
        });
    });
}

// Event listeners initialization
function initializeEventListeners() {
    // Grade selection changes
    document.getElementById('masterGradeSelect').addEventListener('change', function() {
        generateMasterTimetable(this.value);
    });
    
    document.getElementById('classSelect').addEventListener('change', function() {
        generateClassTimetable(this.value);
    });
    
    document.getElementById('teacherSelect').addEventListener('change', function() {
        generateTeacherTimetable(this.value);
    });
    
    document.getElementById('freePeriodGradeSelect').addEventListener('change', function() {
        generateFreePeriodTimetable(this.value);
    });
    
    document.getElementById('teacherFreeSelect').addEventListener('change', function() {
        generateTeacherFreeTimetable(this.value);
    });
    
    document.getElementById('gradeSelectDashboard').addEventListener('change', function() {
        generateAllTimetables(this.value);
    });
    
    // Generate all timetables button
    document.getElementById('generateAll').addEventListener('click', function() {
        const grade = document.getElementById('gradeSelectDashboard').value;
        generateAllTimetables(grade);
        
        // Show success animation
        const button = this;
        const originalText = button.textContent;
        button.textContent = 'Generating...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'All Timetables Generated!';
            button.style.backgroundColor = '#2ecc71';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.disabled = false;
            }, 2000);
        }, 1000);
    });
    
    // AI suggestion buttons
    document.querySelectorAll('.ai-suggestion-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const suggestion = this.textContent;
            showAIFeedback(suggestion);
        });
    });
    
    // Export buttons
    document.querySelectorAll('.btn-export').forEach(btn => {
        if (btn.id !== 'exportAll') {
            btn.addEventListener('click', function() {
                const type = this.getAttribute('data-export');
                exportTimetable(type);
            });
        }
    });
    
    // Export all button
    document.getElementById('exportAll').addEventListener('click', function() {
        exportAllTimetables();
    });
}

// Generate all timetables for a specific grade
function generateAllTimetables(grade) {
    generateMasterTimetable(grade);
    generateClassTimetable(grade);
    generateTeacherTimetable('all');
    generateFreePeriodTimetable(grade);
    generateTeacherFreeTimetable('all');
    updateDashboardStats();
}

// Generate master timetable
function generateMasterTimetable(grade) {
    const container = document.getElementById('masterTimetableContent');
    const subjects = subjectsData[grade];
    
    let html = `<table class="timetable">
        <thead>
            <tr>
                <th>Period/Day</th>`;
    
    // Add day headers
    days.forEach(day => {
        html += `<th>${day}</th>`;
    });
    
    html += `</tr></thead><tbody>`;
    
    // Generate timetable rows
    for (let i = 0; i < periods.length; i++) {
        html += `<tr>
            <th>${periods[i]}</th>`;
        
        for (let j = 0; j < days.length; j++) {
            const subjectIndex = (i * days.length + j) % subjects.length;
            const subject = subjects[subjectIndex];
            const teacher = teachersData.find(t => t.subject === subject.name) || { name: "TBA" };
            
            const bgColor = subjectColors[subject.name] || '#95a5a6';
            
            html += `<td class="subject-cell" style="background-color: ${bgColor}; color: white;">
                <div class="subject-name">${subject.name}</div>
                <div class="teacher-name">${teacher.name}</div>
                <div class="subject-medium">${subject.medium}</div>
            </td>`;
        }
        
        html += `</tr>`;
    }
    
    html += `</tbody></table>`;
    container.innerHTML = html;
    
    // Add hover effects
    addTableCellHoverEffects(container);
}

// Generate class-wise timetable
function generateClassTimetable(grade) {
    const container = document.getElementById('classTimetableContent');
    const subjects = subjectsData[grade];
    
    let html = `<table class="timetable">
        <thead>
            <tr>
                <th>Period/Day</th>`;
    
    days.forEach(day => {
        html += `<th>${day}</th>`;
    });
    
    html += `</tr></thead><tbody>`;
    
    for (let i = 0; i < periods.length; i++) {
        html += `<tr>
            <th>${periods[i]}</th>`;
        
        for (let j = 0; j < days.length; j++) {
            const subjectIndex = (i * days.length + j) % subjects.length;
            const subject = subjects[subjectIndex];
            const teacher = teachersData.find(t => t.subject === subject.name) || { name: "TBA" };
            
            const bgColor = subjectColors[subject.name] || '#95a5a6';
            
            html += `<td class="subject-cell" style="background-color: ${bgColor}; color: white;">
                <div class="subject-name">${subject.name}</div>
                <div class="teacher-name">${teacher.name}</div>
                ${subject.areas ? `<div class="subject-areas">${subject.areas.join(', ')}</div>` : ''}
            </td>`;
        }
        
        html += `</tr>`;
    }
    
    html += `</tbody></table>`;
    container.innerHTML = html;
    
    addTableCellHoverEffects(container);
}

// Generate teacher-wise timetable
function generateTeacherTimetable(teacherId) {
    const container = document.getElementById('teacherTimetableContent');
    
    let html = `<table class="timetable">
        <thead>
            <tr>
                <th>Period/Day</th>`;
    
    days.forEach(day => {
        html += `<th>${day}</th>`;
    });
    
    html += `</tr></thead><tbody>`;
    
    for (let i = 0; i < periods.length; i++) {
        html += `<tr>
            <th>${periods[i]}</th>`;
        
        for (let j = 0; j < days.length; j++) {
            // For demo purposes, we'll generate a sample timetable
            const subjectIndex = (i * days.length + j) % 5;
            const grades = ['Grade III', 'Grade IV', 'Grade V'];
            const grade = grades[subjectIndex % grades.length];
            
            const subjects = ['Mathematics', 'Science', 'English', 'Sindhi/Urdu', 'Social Studies'];
            const subject = subjects[subjectIndex];
            
            const bgColor = subjectColors[subject] || '#95a5a6';
            
            html += `<td class="subject-cell" style="background-color: ${bgColor}; color: white;">
                <div class="subject-name">${subject}</div>
                <div class="class-name">${grade}</div>
                <div class="period-time">${periods[i]} Period</div>
            </td>`;
        }
        
        html += `</tr>`;
    }
    
    html += `</tbody></table>`;
    container.innerHTML = html;
    
    addTableCellHoverEffects(container);
}

// Generate free periods timetable
function generateFreePeriodTimetable(grade) {
    const container = document.getElementById('freePeriodContent');
    
    let html = `<table class="timetable">
        <thead>
            <tr>
                <th>Period/Day</th>`;
    
    days.forEach(day => {
        html += `<th>${day}</th>`;
    });
    
    html += `</tr></thead><tbody>`;
    
    for (let i = 0; i < periods.length; i++) {
        html += `<tr>
            <th>${periods[i]}</th>`;
        
        for (let j = 0; j < days.length; j++) {
            // Randomly assign free periods (about 20% chance)
            const isFree = Math.random() < 0.2;
            
            if (isFree) {
                html += `<td class="free-period">
                    <div>Free Period</div>
                    <div>No Class</div>
                </td>`;
            } else {
                const subjectIndex = (i * days.length + j) % 5;
                const subjects = ['Mathematics', 'Science', 'English', 'Sindhi/Urdu', 'Social Studies'];
                const subject = subjects[subjectIndex];
                const teacher = teachersData.find(t => t.subject === subject) || { name: "TBA" };
                
                const bgColor = subjectColors[subject] || '#95a5a6';
                
                html += `<td class="subject-cell" style="background-color: ${bgColor}; color: white;">
                    <div class="subject-name">${subject}</div>
                    <div class="teacher-name">${teacher.name}</div>
                </td>`;
            }
        }
        
        html += `</tr>`;
    }
    
    html += `</tbody></table>`;
    container.innerHTML = html;
    
    addTableCellHoverEffects(container);
}

// Generate teacher free periods timetable
function generateTeacherFreeTimetable(teacherId) {
    const container = document.getElementById('teacherFreeContent');
    
    let html = `<table class="timetable">
        <thead>
            <tr>
                <th>Period/Day</th>`;
    
    days.forEach(day => {
        html += `<th>${day}</th>`;
    });
    
    html += `</tr></thead><tbody>`;
    
    for (let i = 0; i < periods.length; i++) {
        html += `<tr>
            <th>${periods[i]}</th>`;
        
        for (let j = 0; j < days.length; j++) {
            // Randomly assign teacher free periods (about 30% chance)
            const isFree = Math.random() < 0.3;
            
            if (isFree) {
                html += `<td class="teacher-free">
                    <div>Free</div>
                    <div>Available</div>
                </td>`;
            } else {
                const subjectIndex = (i * days.length + j) % 5;
                const grades = ['Grade III', 'Grade IV', 'Grade V'];
                const grade = grades[subjectIndex % grades.length];
                
                const subjects = ['Mathematics', 'Science', 'English', 'Sindhi/Urdu', 'Social Studies'];
                const subject = subjects[subjectIndex];
                
                const bgColor = subjectColors[subject] || '#95a5a6';
                
                html += `<td class="subject-cell" style="background-color: ${bgColor}; color: white;">
                    <div class="subject-name">${subject}</div>
                    <div class="class-name">${grade}</div>
                </td>`;
            }
        }
        
        html += `</tr>`;
    }
    
    html += `</tbody></table>`;
    container.innerHTML = html;
    
    addTableCellHoverEffects(container);
}

// Add hover effects to table cells
function addTableCellHoverEffects(container) {
    const cells = container.querySelectorAll('.subject-cell');
    
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
        });
        
        cell.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
            this.style.boxShadow = '';
        });
    });
}

// Update dashboard statistics
function updateDashboardStats() {
    const grade = document.getElementById('gradeSelectDashboard').value;
    const subjects = subjectsData[grade];
    
    // In a real application, these would be calculated dynamically
    document.querySelectorAll('.stat-value')[0].textContent = subjects.length;
    document.querySelectorAll('.stat-value')[1].textContent = teachersData.length;
    document.querySelectorAll('.stat-value')[2].textContent = '3'; // Grades III, IV, V
    document.querySelectorAll('.stat-value')[3].textContent = subjects.reduce((sum, subj) => sum + subj.periods, 0);
}

// Show AI feedback for suggestions
function showAIFeedback(suggestion) {
    const aiMessage = document.querySelector('.ai-message');
    const originalMessage = aiMessage.textContent;
    
    let response = "";
    
    switch(suggestion) {
        case "Balance teacher workload":
            response = "I've analyzed teacher workloads. Ms. Aisha has 28 periods while Mr. Ahmed has 22. Suggest redistributing 3 periods for better balance.";
            break;
        case "Optimize classroom usage":
            response = "Classroom utilization is at 78%. I recommend scheduling back-to-back classes in Rooms 101 and 203 to increase efficiency to 85%.";
            break;
        case "Check for conflicts":
            response = "No major conflicts detected. Minor overlap in Science lab usage on Tuesday. Suggest moving Grade IV lab to Wednesday morning.";
            break;
        default:
            response = "I can help optimize your timetable. Please select a specific suggestion or ask a question.";
    }
    
    aiMessage.textContent = response;
    
    // Reset after 5 seconds
    setTimeout(() => {
        aiMessage.textContent = originalMessage;
    }, 5000);
}

// Export timetable functions
function exportTimetable(type) {
    const gradeSelect = document.getElementById(`${type}GradeSelect`) || 
                        document.getElementById(`${type}Select`) || 
                        document.getElementById('gradeSelectDashboard');
    
    const grade = gradeSelect ? gradeSelect.value : 'grade3';
    
    // Get the current timetable data
    const timetableData = getTimetableData(type, grade);
    
    // Export to Word
    exportToWord(type, grade, timetableData);
}

function exportAllTimetables() {
    const grade = document.getElementById('gradeSelectDashboard').value;
    
    // Export all timetables
    const types = ['master', 'class', 'teacher', 'free', 'teacher-free'];
    
    types.forEach(type => {
        const timetableData = getTimetableData(type, grade);
        exportToWord(type, grade, timetableData, true);
    });
    
    // Show export all success message
    const exportBtn = document.getElementById('exportAll');
    const originalText = exportBtn.textContent;
    exportBtn.textContent = 'Exporting All...';
    exportBtn.disabled = true;
    
    setTimeout(() => {
        exportBtn.textContent = 'All Exported!';
        exportBtn.style.backgroundColor = '#2ecc71';
        
        setTimeout(() => {
            exportBtn.textContent = originalText;
            exportBtn.style.backgroundColor = '';
            exportBtn.disabled = false;
        }, 3000);
    }, 2000);
}

// Get timetable data for export
function getTimetableData(type, grade) {
    let timetableData = {
        title: getTitleForType(type),
        grade: grade,
        days: days,
        periods: periods,
        data: []
    };
    
    // In a real implementation, this would extract data from the actual timetable
    // For now, we'll generate sample data
    for (let i = 0; i < periods.length; i++) {
        const row = [];
        for (let j = 0; j < days.length; j++) {
            if (type === 'free') {
                const isFree = Math.random() < 0.2;
                if (isFree) {
                    row.push({ type: 'free', text: 'Free Period' });
                } else {
                    const subjects = ['Mathematics', 'Science', 'English', 'Sindhi/Urdu', 'Social Studies'];
                    const subject = subjects[(i * days.length + j) % subjects.length];
                    row.push({ type: 'subject', text: subject, subject: subject });
                }
            } else if (type === 'teacher-free') {
                const isFree = Math.random() < 0.3;
                if (isFree) {
                    row.push({ type: 'free', text: 'Teacher Free' });
                } else {
                    const subjects = ['Mathematics', 'Science', 'English', 'Sindhi/Urdu', 'Social Studies'];
                    const subject = subjects[(i * days.length + j) % subjects.length];
                    row.push({ type: 'subject', text: subject, subject: subject });
                }
            } else {
                const subjects = ['Mathematics', 'Science', 'English', 'Sindhi/Urdu', 'Social Studies'];
                const subject = subjects[(i * days.length + j) % subjects.length];
                row.push({ type: 'subject', text: subject, subject: subject });
            }
        }
        timetableData.data.push(row);
    }
    
    return timetableData;
}

function getTitleForType(type) {
    const titles = {
        'master': 'Master Timetable',
        'class': 'Class-wise Timetable',
        'teacher': 'Teacher-wise Timetable',
        'free': 'Free Periods Timetable',
        'teacher-free': 'Teacher Free Periods Timetable'
    };
    
    return titles[type] || 'Timetable';
}

// Export to Word function
function exportToWord(type, grade, timetableData, isBatch = false) {
    // Create a simple HTML representation for export
    let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>${timetableData.title} - ${grade}</title>
            <style>
                body { font-family: Arial, sans-serif; }
                h1 { color: #2F5496; text-align: center; }
                h2 { color: #2F5496; }
                table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: center; }
                th { background-color: #2F5496; color: white; font-weight: bold; }
                .free-period { background-color: #f2f2f2; color: #666; font-style: italic; }
                .subject-cell { font-weight: bold; }
                @page { size: landscape; }
            </style>
        </head>
        <body>
            <h1>${timetableData.title}</h1>
            <h2>Grade: ${grade.replace('grade', 'Grade ').toUpperCase()}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Period/Day</th>
    `;
    
    // Add day headers
    timetableData.days.forEach(day => {
        htmlContent += `<th>${day}</th>`;
    });
    
    htmlContent += `</tr></thead><tbody>`;
    
    // Add timetable rows
    for (let i = 0; i < timetableData.periods.length; i++) {
        htmlContent += `<tr><th>${timetableData.periods[i]}</th>`;
        
        for (let j = 0; j < timetableData.days.length; j++) {
            const cell = timetableData.data[i][j];
            if (cell.type === 'free') {
                htmlContent += `<td class="free-period">${cell.text}</td>`;
            } else {
                htmlContent += `<td class="subject-cell">${cell.text}</td>`;
            }
        }
        
        htmlContent += `</tr>`;
    }
    
    htmlContent += `</tbody></table></body></html>`;
    
    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const filename = `${timetableData.title.replace(/\s+/g, '_')}_${grade}.doc`;
    
    saveAs(blob, filename);
    
    if (!isBatch) {
        // Show export success message
        const exportBtn = document.querySelector(`.btn-export[data-export="${type}"]`);
        if (exportBtn) {
            const originalText = exportBtn.textContent;
            exportBtn.textContent = 'Exporting...';
            exportBtn.disabled = true;
            
            setTimeout(() => {
                exportBtn.textContent = 'Exported!';
                exportBtn.style.backgroundColor = '#2ecc71';
                
                setTimeout(() => {
                    exportBtn.textContent = originalText;
                    exportBtn.style.backgroundColor = '';
                    exportBtn.disabled = false;
                }, 2000);
            }, 1000);
        }
    }
}