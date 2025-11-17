// DOM Elements
const employeeName = document.getElementById('employeeName');
const employeeCnic = document.getElementById('employeeCnic');
const companyName = document.getElementById('companyName');
const department = document.getElementById('department');
const designation = document.getElementById('designation');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const experienceText = document.getElementById('experienceText');
const issuerName = document.getElementById('issuerName');
const issuerDesignation = document.getElementById('issuerDesignation');
const signatureUpload = document.getElementById('signatureUpload');
const fontFamily = document.getElementById('fontFamily');
const addExperienceBtn = document.getElementById('addExperience');
const experienceList = document.getElementById('experienceList');
const generateBtn = document.getElementById('generateBtn');
const exportWordBtn = document.getElementById('exportWord');
const resetBtn = document.getElementById('resetBtn');
const colorOptions = document.querySelectorAll('.color-option');
const suggestionItems = document.querySelectorAll('.suggestion-item');

// Preview Elements
const previewName = document.getElementById('previewName');
const previewName2 = document.getElementById('previewName2');
const previewCnic = document.getElementById('previewCnic');
const previewCompany = document.getElementById('previewCompany');
const previewDepartment = document.getElementById('previewDepartment');
const previewDesignation = document.getElementById('previewDesignation');
const previewStartDate = document.getElementById('previewStartDate');
const previewEndDate = document.getElementById('previewEndDate');
const previewExperienceList = document.getElementById('previewExperienceList');
const previewIssuerName = document.getElementById('previewIssuerName');
const previewIssuerDesignation = document.getElementById('previewIssuerDesignation');
const previewSignature = document.getElementById('previewSignature');
const previewCurrentDate = document.getElementById('previewCurrentDate');
const certificatePreview = document.getElementById('certificatePreview');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    previewCurrentDate.textContent = currentDate;
    
    // Add event listeners
    initializeEventListeners();
    
    // Load sample data for demo (remove in production)
    loadSampleData();
});

function initializeEventListeners() {
    // Form input listeners
    employeeName.addEventListener('input', updatePreview);
    employeeCnic.addEventListener('input', updatePreview);
    companyName.addEventListener('input', updatePreview);
    department.addEventListener('change', updatePreview);
    designation.addEventListener('input', updatePreview);
    startDate.addEventListener('change', updatePreview);
    endDate.addEventListener('change', updatePreview);
    issuerName.addEventListener('input', updatePreview);
    issuerDesignation.addEventListener('input', updatePreview);
    fontFamily.addEventListener('change', updatePreview);
    
    // Experience management
    addExperienceBtn.addEventListener('click', addExperiencePoint);
    
    // Color theme selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            applyColorTheme(this.getAttribute('data-color'));
        });
    });
    
    // AI Suggestions
    suggestionItems.forEach(item => {
        item.addEventListener('click', function() {
            experienceText.value = this.getAttribute('data-text');
        });
    });
    
    // Signature upload
    signatureUpload.addEventListener('change', handleSignatureUpload);
    
    // Action buttons
    generateBtn.addEventListener('click', generateCertificate);
    exportWordBtn.addEventListener('click', exportToWord);
    resetBtn.addEventListener('click', resetForm);
}

function updatePreview() {
    // Update text content
    previewName.textContent = employeeName.value || '[Employee Name]';
    previewName2.textContent = employeeName.value || '[Employee Name]';
    previewCnic.textContent = employeeCnic.value || '[CNIC Number]';
    previewCompany.textContent = companyName.value || '[Company Name]';
    previewDepartment.textContent = department.value || '[Department]';
    previewDesignation.textContent = designation.value || '[Designation]';
    previewStartDate.textContent = startDate.value ? formatDate(startDate.value) : '[Start Date]';
    previewEndDate.textContent = endDate.value ? formatDate(endDate.value) : '[End Date]';
    previewIssuerName.textContent = issuerName.value || '[Issuer Name]';
    previewIssuerDesignation.textContent = issuerDesignation.value || '[Issuer Designation]';
    
    // Update font family
    certificatePreview.style.fontFamily = fontFamily.value;
    
    // Update experience list
    updateExperiencePreview();
}

function addExperiencePoint() {
    const text = experienceText.value.trim();
    if (!text) {
        alert('Please enter experience description first');
        return;
    }
    
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    experienceItem.innerHTML = `
        <div class="experience-text">${text}</div>
        <button class="remove-experience"><i class="fas fa-times"></i></button>
    `;
    
    experienceList.appendChild(experienceItem);
    experienceText.value = '';
    
    // Add remove functionality
    experienceItem.querySelector('.remove-experience').addEventListener('click', function() {
        experienceItem.remove();
        updateExperiencePreview();
    });
    
    updateExperiencePreview();
}

function updateExperiencePreview() {
    const experiencePoints = document.querySelectorAll('.experience-item .experience-text');
    previewExperienceList.innerHTML = '';
    
    if (experiencePoints.length > 0) {
        experiencePoints.forEach(point => {
            const li = document.createElement('li');
            li.textContent = point.textContent;
            previewExperienceList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No experience points added yet';
        previewExperienceList.appendChild(li);
    }
}

function applyColorTheme(color) {
    // Update certificate header color
    const header = document.querySelector('.certificate-header h1');
    header.style.color = color;
    
    // Update decoration colors
    const decorations = document.querySelectorAll('.decoration-left, .decoration-right, .border-decoration');
    decorations.forEach(decoration => {
        decoration.style.borderColor = color;
    });
    
    // Update center decoration
    const centerDecoration = document.querySelector('.decoration-center');
    centerDecoration.style.color = color;
}

function handleSignatureUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Update signature preview in form
        const signaturePreview = document.getElementById('signaturePreview');
        signaturePreview.innerHTML = `<img src="${e.target.result}" alt="Signature">`;
        
        // Update signature in certificate preview
        previewSignature.innerHTML = `<img src="${e.target.result}" alt="Signature" style="max-width: 150px; max-height: 60px;">`;
    };
    reader.readAsDataURL(file);
}

function generateCertificate() {
    if (!validateForm()) {
        alert('Please fill in all required fields marked with *');
        return;
    }
    
    updatePreview();
    
    // Add generation animation
    certificatePreview.style.animation = 'fadeIn 0.5s ease';
    setTimeout(() => {
        certificatePreview.style.animation = '';
    }, 500);
    
    alert('Certificate generated successfully! You can now export it as a Word document.');
}

function exportToWord() {
    if (!validateForm()) {
        alert('Please fill all required fields and generate certificate first');
        return;
    }
    
    // In a real implementation, use a library like html-docx-js
    // This is a simplified version for demonstration
    
    const certificateContent = document.getElementById('certificatePreview').innerHTML;
    
    // Create a Blob with the content (simulating Word export)
    const blob = new Blob([`
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>Experience Certificate</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .certificate { width: 210mm; min-height: 297mm; padding: 20mm; }
            </style>
        </head>
        <body>
            <div class="certificate">
                ${certificateContent}
            </div>
        </body>
        </html>
    `], { type: 'application/msword' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Experience_Certificate_${employeeName.value || 'employee'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Certificate exported as Word document successfully!');
}

function resetForm() {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
        // Reset form inputs
        document.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.type !== 'file') {
                element.value = '';
            }
        });
        
        // Reset file input
        signatureUpload.value = '';
        document.getElementById('signaturePreview').innerHTML = '';
        
        // Reset experience list
        experienceList.innerHTML = '';
        
        // Reset preview
        resetPreview();
        
        // Reset color theme to default
        colorOptions.forEach(opt => opt.classList.remove('active'));
        colorOptions[0].classList.add('active');
        applyColorTheme(colorOptions[0].getAttribute('data-color'));
        
        alert('Form reset successfully!');
    }
}

function resetPreview() {
    previewName.textContent = '[Employee Name]';
    previewName2.textContent = '[Employee Name]';
    previewCnic.textContent = '[CNIC Number]';
    previewCompany.textContent = '[Company Name]';
    previewDepartment.textContent = '[Department]';
    previewDesignation.textContent = '[Designation]';
    previewStartDate.textContent = '[Start Date]';
    previewEndDate.textContent = '[End Date]';
    previewIssuerName.textContent = '[Issuer Name]';
    previewIssuerDesignation.textContent = '[Issuer Designation]';
    previewSignature.innerHTML = '<div class="signature-line"></div>';
    previewExperienceList.innerHTML = `
        <li>Sample responsibility or achievement</li>
        <li>Another key contribution</li>
    `;
    certificatePreview.style.fontFamily = 'Poppins';
}

function validateForm() {
    const requiredFields = [
        employeeName, employeeCnic, companyName, 
        department, designation, startDate, endDate,
        issuerName, issuerDesignation
    ];
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--warning)';
            return false;
        } else {
            field.style.borderColor = '';
        }
    }
    
    return true;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Sample data for demonstration (remove in production)
function loadSampleData() {
    employeeName.value = 'Sarah Johnson';
    employeeCnic.value = '12345-6789012-3';
    companyName.value = 'Global Tech Solutions';
    department.value = 'Information Technology';
    designation.value = 'Senior Software Engineer';
    startDate.value = '2020-03-15';
    endDate.value = '2023-08-30';
    issuerName.value = 'Michael Roberts';
    issuerDesignation.value = 'Head of Technology';
    
    // Add sample experience points
    experienceText.value = 'Developed and maintained web applications using modern technologies';
    addExperiencePoint();
    
    experienceText.value = 'Led a team of 5 developers in creating a customer portal';
    addExperiencePoint();
    
    experienceText.value = 'Improved application performance by 40% through optimization';
    addExperiencePoint();
    
    updatePreview();
}