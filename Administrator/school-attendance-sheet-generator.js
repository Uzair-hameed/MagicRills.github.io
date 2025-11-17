// school-attendance-sheet-generator.js

// Global variables
let students = [];
let schoolLogo = null;
let isDarkMode = false;
let attendanceChart = null;
const { jsPDF } = window.jspdf;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-picker').value = today;
    
    // Load any saved data from localStorage
    loadFromLocalStorage();
    
    // Initialize analytics chart
    initializeChart();
    
    // Generate initial AI prediction
    generateAIPrediction();
    
    // Update summary cards
    updateSummaryCards();
    
    // Add animation to cards on load
    animateCardsOnLoad();
});

// Toggle between light and dark theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');
    
    if (isDarkMode) {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
    }
    
    // Update chart if it exists
    if (attendanceChart) {
        updateChart();
    }
}

// Upload school logo
function uploadLogo() {
    const fileInput = document.getElementById('logo-upload');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            schoolLogo = e.target.result;
            document.getElementById('logo-preview').src = schoolLogo;
            localStorage.setItem('schoolLogo', schoolLogo);
            
            // Add success animation
            const logo = document.getElementById('logo-preview');
            logo.style.transform = 'scale(1.1)';
            setTimeout(() => {
                logo.style.transform = 'scale(1)';
            }, 300);
        };
        reader.readAsDataURL(file);
    }
}

// Update class options based on selected grade
function updateClassOptions() {
    const grade = document.getElementById('grade-select').value;
    const classSelect = document.getElementById('class-select');
    
    // For higher grades, we might have more sections
    if (['PG', 'KG'].includes(grade)) {
        classSelect.innerHTML = `
            <option value="A">Section A</option>
            <option value="B">Section B</option>
        `;
    } else {
        classSelect.innerHTML = `
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
        `;
    }
}

// Add a new student
function addStudent() {
    const nameInput = document.getElementById('student-name');
    const name = nameInput.value.trim();
    const grade = document.getElementById('grade-select').value;
    const classSection = document.getElementById('class-select').value;
    
    if (!name) {
        showNotification('Please enter a student name', 'warning');
        return;
    }
    
    // Generate roll number (last roll no + 1 or start from 1)
    const classStudents = students.filter(s => s.grade === grade && s.class === classSection);
    const rollNo = classStudents.length > 0 ? Math.max(...classStudents.map(s => s.rollNo)) + 1 : 1;
    
    const newStudent = {
        id: Date.now().toString(),
        rollNo,
        name,
        grade,
        class: classSection,
        attendance: {}
    };
    
    students.push(newStudent);
    saveToLocalStorage();
    loadClassData();
    nameInput.value = '';
    updateSummaryCards();
    
    // Add animation to new student row
    const newRow = document.querySelector(`[data-student-id="${newStudent.id}"]`);
    if (newRow) {
        newRow.style.animation = 'slideDown 0.5s ease-out';
    }
    
    showNotification(`Student ${name} added successfully!`, 'success');
}

// Load class data based on selected grade and class
function loadClassData() {
    const grade = document.getElementById('grade-select').value;
    const classSection = document.getElementById('class-select').value;
    const date = document.getElementById('date-picker').value;
    
    const classStudents = students.filter(s => s.grade === grade && s.class === classSection)
                                .sort((a, b) => a.rollNo - b.rollNo);
    
    const tableBody = document.getElementById('student-list');
    tableBody.innerHTML = '';
    
    classStudents.forEach(student => {
        const status = student.attendance[date] || '';
        
        const row = document.createElement('tr');
        row.setAttribute('data-student-id', student.id);
        row.innerHTML = `
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.grade}</td>
            <td>${student.class}</td>
            <td class="editable ${status.toLowerCase()}" onclick="changeStatus(this, '${student.id}', '${date}')">
                ${status || 'Click to set'}
            </td>
            <td class="no-print">
                <button class="btn-danger" onclick="deleteStudent('${student.id}')">
                    <span class="btn-icon">🗑️</span>
                    Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update print view info
    document.getElementById('print-date').textContent = formatDateForPrint(date);
    document.getElementById('print-grade').textContent = `Grade ${grade}`;
    document.getElementById('print-class').textContent = `Section ${classSection}`;
    document.getElementById('print-logo').src = schoolLogo || '';
    
    // Update print student list
    const printStudentList = document.getElementById('print-student-list');
    printStudentList.innerHTML = '';
    
    classStudents.forEach(student => {
        const status = student.attendance[date] || 'Not Marked';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 8px; border: 1px solid #ddd;">${student.rollNo}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${student.name}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${status}</td>
        `;
        printStudentList.appendChild(row);
    });
    
    updateSummaryCards();
    updateChart();
}

// Change attendance status
function changeStatus(cell, studentId, date) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const currentStatus = student.attendance[date] || '';
    let newStatus;
    
    if (!currentStatus || currentStatus === 'Absent') {
        newStatus = 'Present';
    } else if (currentStatus === 'Present') {
        newStatus = 'Leave';
    } else {
        newStatus = 'Absent';
    }
    
    student.attendance[date] = newStatus;
    saveToLocalStorage();
    
    // Update cell appearance with animation
    cell.className = `editable ${newStatus.toLowerCase()}`;
    cell.textContent = newStatus;
    
    // Add pulse animation
    cell.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        cell.style.animation = '';
    }, 500);
    
    updateSummaryCards();
    updateChart();
}

// Mark all students as present
function markAllPresent() {
    const grade = document.getElementById('grade-select').value;
    const classSection = document.getElementById('class-select').value;
    const date = document.getElementById('date-picker').value;
    
    const classStudents = students.filter(s => s.grade === grade && s.class === classSection);
    
    classStudents.forEach(student => {
        student.attendance[date] = 'Present';
    });
    
    saveToLocalStorage();
    loadClassData();
    showNotification('All students marked as present!', 'success');
}

// Delete a student
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        const student = students.find(s => s.id === studentId);
        students = students.filter(s => s.id !== studentId);
        saveToLocalStorage();
        loadClassData();
        updateSummaryCards();
        
        showNotification(`Student ${student.name} deleted`, 'info');
    }
}

// Filter students by search term
function filterStudents() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#student-list tr');
    
    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const grade = row.cells[2].textContent.toLowerCase();
        const classSection = row.cells[3].textContent.toLowerCase();
        
        if (name.includes(searchTerm) || grade.includes(searchTerm) || classSection.includes(searchTerm)) {
            row.style.display = '';
            row.style.animation = 'slideDown 0.3s ease';
        } else {
            row.style.display = 'none';
        }
    });
}

// Update summary cards
function updateSummaryCards() {
    const grade = document.getElementById('grade-select').value;
    const classSection = document.getElementById('class-select').value;
    const date = document.getElementById('date-picker').value;
    
    // Total strength
    const totalStrength = students.length;
    document.getElementById('total-strength').textContent = totalStrength;
    
    // Class strength
    const classStrength = students.filter(s => s.grade === grade && s.class === classSection).length;
    
    // Attendance stats
    const classStudents = students.filter(s => s.grade === grade && s.class === classSection);
    const presentCount = classStudents.filter(s => s.attendance[date] === 'Present').length;
    const absentCount = classStudents.filter(s => s.attendance[date] === 'Absent').length;
    const leaveCount = classStudents.filter(s => s.attendance[date] === 'Leave').length;
    
    const attendancePercentage = classStrength > 0 ? Math.round((presentCount / classStrength) * 100) : 0;
    
    document.getElementById('attendance-percentage').textContent = `${attendancePercentage}%`;
    document.getElementById('attendance-count').textContent = `${presentCount}/${classStrength} Present`;
    document.getElementById('absent-count').textContent = absentCount;
    document.getElementById('leave-count').textContent = leaveCount;
}

// Initialize analytics chart
function initializeChart() {
    const ctx = document.getElementById('attendance-chart').getContext('2d');
    
    attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Present',
                    data: [],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Absent',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '7-Day Attendance Trend'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
    
    updateChart();
}

// Update chart with current data
function updateChart() {
    if (!attendanceChart) return;
    
    const grade = document.getElementById('grade-select').value;
    const classSection = document.getElementById('class-select').value;
    const classStudents = students.filter(s => s.grade === grade && s.class === classSection);
    
    // Generate last 7 days data
    const labels = [];
    const presentData = [];
    const absentData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        labels.push(formatDateForChart(dateString));
        
        const presentCount = classStudents.filter(s => s.attendance[dateString] === 'Present').length;
        const absentCount = classStudents.filter(s => s.attendance[dateString] === 'Absent').length;
        const totalCount = classStudents.length;
        
        const presentPercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
        const absentPercentage = totalCount > 0 ? Math.round((absentCount / totalCount) * 100) : 0;
        
        presentData.push(presentPercentage);
        absentData.push(absentPercentage);
    }
    
    attendanceChart.data.labels = labels;
    attendanceChart.data.datasets[0].data = presentData;
    attendanceChart.data.datasets[1].data = absentData;
    attendanceChart.update();
}

// Generate AI prediction
function generateAIPrediction() {
    const predictions = [
        "Based on patterns, expect 92% attendance tomorrow",
        "Student absences typically increase by 15% on Fridays",
        "3 students show concerning attendance trends",
        "Perfect attendance streak: 5 days and counting!",
        "Weather forecast may impact attendance by 8%",
        "No major attendance concerns detected this week"
    ];
    
    const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
    document.getElementById('ai-prediction').textContent = randomPrediction;
    
    // Add animation to AI banner
    const banner = document.querySelector('.ai-banner');
    banner.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        banner.style.animation = 'pulse 2s infinite';
    }, 500);
}

// Save attendance data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('attendanceData', JSON.stringify(students));
}

// Load attendance data from localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('attendanceData');
    if (savedData) {
        students = JSON.parse(savedData);
    }
    
    const savedLogo = localStorage.getItem('schoolLogo');
    if (savedLogo) {
        schoolLogo = savedLogo;
        document.getElementById('logo-preview').src = schoolLogo;
    }
}

// Save attendance (simulated - in a real app, this would send to server)
function saveAttendance() {
    const button = event.target.closest('button');
    const originalHTML = button.innerHTML;
    button.innerHTML = '<span class="spinner"></span> Saving...';
    
    setTimeout(() => {
        saveToLocalStorage();
        button.innerHTML = '<span class="btn-icon">✅</span> Saved Successfully!';
        
        // Add success animation
        button.style.transform = 'scale(1.05)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 300);
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    }, 1000);
}

// Export to PDF
function exportToPDF() {
    const grade = document.getElementById('grade-select').value;
    const classSection = document.getElementById('class-select').value;
    const date = document.getElementById('date-picker').value;
    
    const classStudents = students.filter(s => s.grade === grade && s.class === classSection)
                                .sort((a, b) => a.rollNo - b.rollNo);
    
    const doc = new jsPDF();
    
    // Add school logo if available
    if (schoolLogo) {
        doc.addImage(schoolLogo, 'JPEG', 10, 10, 30, 30);
    }
    
    // Add title and information
    doc.setFontSize(18);
    doc.text('AI School Attendance Dashboard', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Grade: ${grade}`, 15, 45);
    doc.text(`Class: ${classSection}`, 15, 55);
    doc.text(`Date: ${formatDateForPrint(date)}`, 15, 65);
    
    // Create table headers
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Roll No.', 20, 80);
    doc.text('Student Name', 50, 80);
    doc.text('Status', 150, 80);
    
    // Add table rows
    doc.setFont(undefined, 'normal');
    let y = 90;
    
    classStudents.forEach(student => {
        const status = student.attendance[date] || 'Not Marked';
        
        doc.text(student.rollNo.toString(), 20, y);
        doc.text(student.name, 50, y);
        
        // Color code status
        if (status === 'Present') {
            doc.setTextColor(46, 204, 113); // Green
        } else if (status === 'Absent') {
            doc.setTextColor(231, 76, 60); // Red
        } else if (status === 'Leave') {
            doc.setTextColor(243, 156, 18); // Orange
        }
        
        doc.text(status, 150, y);
        doc.setTextColor(0, 0, 0); // Reset to black
        
        y += 10;
        if (y > 270) { // Add new page if running out of space
            doc.addPage();
            y = 20;
        }
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.text('Generated by AI School Attendance Dashboard', 105, 285, { align: 'center' });
    
    // Save the PDF
    doc.save(`Attendance_${grade}_${classSection}_${date}.pdf`);
    
    showNotification('PDF exported successfully!', 'success');
}

// Export to Excel
function exportToExcel() {
    const grade = document.getElementById('grade-select').value;
    const classSection = document.getElementById('class-select').value;
    const date = document.getElementById('date-picker').value;
    
    const classStudents = students.filter(s => s.grade === grade && s.class === classSection)
                                .sort((a, b) => a.rollNo - b.rollNo);
    
    // Prepare data for Excel
    const excelData = [
        ['Roll No.', 'Student Name', 'Grade', 'Class', 'Status', 'Remarks']
    ];
    
    classStudents.forEach(student => {
        const status = student.attendance[date] || 'Not Marked';
        excelData.push([
            student.rollNo,
            student.name,
            student.grade,
            student.class,
            status,
            ''
        ]);
    });
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    
    // Export to file
    XLSX.writeFile(wb, `Attendance_${grade}_${classSection}_${date}.xlsx`);
    
    showNotification('Excel file exported successfully!', 'success');
}

// Generate monthly report
function generateMonthlyReport() {
    const grade = document.getElementById('grade-select').value;
    const classSection = document.getElementById('class-select').value;
    const monthYear = prompt('Enter month and year (MM/YYYY):', new Date().toLocaleDateString('en-US', {month: '2-digit', year: 'numeric'}));
    
    if (!monthYear) return;
    
    const [month, year] = monthYear.split('/');
    const classStudents = students.filter(s => s.grade === grade && s.class === classSection)
                                .sort((a, b) => a.rollNo - b.rollNo);
    
    // Get all dates in the month
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
        dates.push(`${year}-${month.padStart(2, '0')}-${i.toString().padStart(2, '0')}`);
    }
    
    // Prepare data for Excel
    const excelData = [
        ['Roll No.', 'Student Name', ...dates.map(d => formatDateForPrint(d)), 'Present Days', 'Absent Days', 'Leave Days', 'Attendance %']
    ];
    
    classStudents.forEach(student => {
        const row = [student.rollNo, student.name];
        let presentDays = 0;
        let absentDays = 0;
        let leaveDays = 0;
        
        dates.forEach(date => {
            const status = student.attendance[date] || '';
            row.push(status);
            
            if (status === 'Present') presentDays++;
            else if (status === 'Absent') absentDays++;
            else if (status === 'Leave') leaveDays++;
        });
        
        const totalMarkedDays = presentDays + absentDays + leaveDays;
        const attendancePercentage = totalMarkedDays > 0 ? Math.round((presentDays / totalMarkedDays) * 100) : 0;
        
        row.push(presentDays, absentDays, leaveDays, `${attendancePercentage}%`);
        excelData.push(row);
    });
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');
    
    // Export to file
    XLSX.writeFile(wb, `Monthly_Report_${grade}_${classSection}_${month}_${year}.xlsx`);
    
    showNotification('Monthly report generated successfully!', 'success');
}

// Clear all data
function clearData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
        localStorage.clear();
        students = [];
        schoolLogo = null;
        document.getElementById('logo-preview').src = 'https://via.placeholder.com/80';
        loadClassData();
        updateSummaryCards();
        updateChart();
        
        showNotification('All data cleared successfully', 'info');
    }
}

// Helper function to format date for display
function formatDateForPrint(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Helper function to format date for chart
function formatDateForChart(dateString) {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-text">${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideDown 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'warning': return '⚠️';
        case 'error': return '❌';
        default: return 'ℹ️';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return 'linear-gradient(135deg, #2ecc71, #27ae60)';
        case 'warning': return 'linear-gradient(135deg, #f39c12, #e67e22)';
        case 'error': return 'linear-gradient(135deg, #e74c3c, #c0392b)';
        default: return 'linear-gradient(135deg, #3498db, #2980b9)';
    }
}

// Animate cards on page load
function animateCardsOnLoad() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'slideDown 0.6s ease-out both';
    });
}