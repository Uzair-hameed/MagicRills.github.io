// Main application functionality with ALL export features in one file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Tool Navigation
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(item => {
        item.addEventListener('click', function() {
            const tool = this.getAttribute('data-tool');
            switchTool(tool);
        });
    });

    // Export Navigation
    const exportItems = document.querySelectorAll('.export-item');
    exportItems.forEach(item => {
        item.addEventListener('click', function() {
            const exportType = this.getAttribute('data-export');
            triggerExport(exportType);
        });
    });

    // Form Inputs to Preview
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', updateCardPreview);
    });

    // Color Palette
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            updateCardPreview();
        });
    });

    // Template Selection
    const templateItems = document.querySelectorAll('.template-item');
    templateItems.forEach(item => {
        item.addEventListener('click', function() {
            templateItems.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateCardPreview();
        });
    });

    // Font Controls
    const nameSize = document.getElementById('nameSize');
    const nameSizeValue = document.getElementById('nameSizeValue');
    const titleSize = document.getElementById('titleSize');
    const titleSizeValue = document.getElementById('titleSizeValue');

    nameSize.addEventListener('input', function() {
        nameSizeValue.textContent = this.value + 'px';
        updateCardPreview();
    });

    titleSize.addEventListener('input', function() {
        titleSizeValue.textContent = this.value + 'px';
        updateCardPreview();
    });

    // Alignment Options
    const alignButtons = document.querySelectorAll('.align-btn');
    alignButtons.forEach(button => {
        button.addEventListener('click', function() {
            alignButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateCardPreview();
        });
    });

    // Background Options
    const bgOptions = document.querySelectorAll('.bg-option');
    bgOptions.forEach(option => {
        option.addEventListener('click', function() {
            bgOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            updateCardPreview();
        });
    });

    // File Uploads
    const logoUpload = document.getElementById('logoUpload');
    const logoInput = document.getElementById('logoInput');
    const profileUpload = document.getElementById('profileUpload');
    const profileInput = document.getElementById('profileInput');

    logoUpload.addEventListener('click', () => logoInput.click());
    profileUpload.addEventListener('click', () => profileInput.click());

    logoInput.addEventListener('change', handleLogoUpload);
    profileInput.addEventListener('change', handleProfileUpload);

    // Card Controls
    const flipButton = document.getElementById('flipButton');
    const rotateButton = document.getElementById('rotateButton');
    const resetButton = document.getElementById('resetButton');

    flipButton.addEventListener('click', flipCard);
    rotateButton.addEventListener('click', rotateCard);
    resetButton.addEventListener('click', resetCard);

    // Layout Options
    const layoutOptions = document.querySelectorAll('.layout-option');
    layoutOptions.forEach(option => {
        option.addEventListener('click', function() {
            layoutOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Export Buttons
    document.getElementById('exportPdf').addEventListener('click', () => triggerExport('pdf'));
    document.getElementById('exportWord').addEventListener('click', () => triggerExport('word'));
    document.getElementById('exportPng').addEventListener('click', () => triggerExport('png'));
    document.getElementById('exportJpeg').addEventListener('click', () => triggerExport('jpeg'));

    // Initialize preview
    updateCardPreview();
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    
    const icon = document.querySelector('#themeToggle i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
}

function switchTool(tool) {
    // Update active tool in sidebar
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tool') === tool) {
            item.classList.add('active');
        }
    });

    // Show corresponding panel
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.getElementById(`${tool}-panel`).classList.add('active');
}

function updateCardPreview() {
    // Update front of card
    document.getElementById('previewName').textContent = 
        document.getElementById('fullName').value || 'Your Name';
    document.getElementById('previewTitle').textContent = 
        document.getElementById('jobTitle').value || 'Job Title';
    document.getElementById('previewCompany').textContent = 
        document.getElementById('company').value || 'Company Name';
    document.getElementById('previewCompanyBack').textContent = 
        document.getElementById('company').value || 'Company Name';
    document.getElementById('previewPhone').textContent = 
        document.getElementById('phone').value || '+1234567890';
    document.getElementById('previewEmail').textContent = 
        document.getElementById('email').value || 'your@email.com';
    document.getElementById('previewAddress').textContent = 
        document.getElementById('address').value || 'Your Address';
    document.getElementById('previewWebsite').textContent = 
        document.getElementById('website').value || 'www.yourwebsite.com';

    // Update fonts
    const nameFont = document.getElementById('nameFont').value;
    const titleFont = document.getElementById('titleFont').value;
    const nameSize = document.getElementById('nameSize').value + 'px';
    const titleSize = document.getElementById('titleSize').value + 'px';
    
    document.getElementById('previewName').style.fontFamily = nameFont;
    document.getElementById('previewName').style.fontSize = nameSize;
    document.getElementById('previewTitle').style.fontFamily = titleFont;
    document.getElementById('previewTitle').style.fontSize = titleSize;

    // Update alignment
    const alignBtn = document.querySelector('.align-btn.active');
    if (alignBtn) {
        const alignment = alignBtn.getAttribute('data-align');
        document.querySelector('.card-content').style.textAlign = alignment;
    }

    // Update color scheme
    const colorOption = document.querySelector('.color-option.active');
    if (colorOption) {
        const color = colorOption.getAttribute('data-color');
        document.documentElement.style.setProperty('--primary-color', color);
        
        // Update card elements with the selected color
        const cardBadges = document.querySelectorAll('.card-badge');
        cardBadges.forEach(badge => {
            badge.style.backgroundColor = color;
        });
        
        const contactIcons = document.querySelectorAll('.card-contact i');
        contactIcons.forEach(icon => {
            icon.style.color = color;
        });
        
        const socialIcons = document.querySelectorAll('.card-social i');
        socialIcons.forEach(icon => {
            icon.style.color = color;
        });
    }

    // Update template
    const templateItem = document.querySelector('.template-item.active');
    if (templateItem) {
        const template = templateItem.getAttribute('data-template');
        applyTemplate(template);
    }
}

function applyTemplate(template) {
    const cardFront = document.querySelector('.card-front');
    const cardBack = document.querySelector('.card-back');
    
    // Reset styles
    cardFront.style.background = 'white';
    cardBack.style.background = '#f8f9fa';
    cardFront.style.color = '#333';
    cardBack.style.color = '#333';
    
    // Apply template-specific styles
    switch(template) {
        case 'modern':
            cardFront.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            cardFront.style.color = 'white';
            break;
        case 'classic':
            cardFront.style.background = '#f5f5f5';
            cardFront.style.border = '2px solid #d4af37';
            break;
        case 'elegant':
            cardFront.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            cardFront.style.color = 'white';
            break;
        case 'creative':
            cardFront.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            cardFront.style.color = 'white';
            break;
        case 'minimal':
            cardFront.style.background = 'white';
            cardFront.style.border = '1px solid #eee';
            break;
        case 'corporate':
            cardFront.style.background = 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)';
            cardFront.style.color = 'white';
            break;
        case 'professional':
            cardFront.style.background = '#2c3e50';
            cardFront.style.color = 'white';
            break;
        case 'business':
            cardFront.style.background = 'linear-gradient(135deg, #434343 0%, #000000 100%)';
            cardFront.style.color = 'white';
            break;
        case 'luxury':
            cardFront.style.background = 'linear-gradient(135deg, #8B7500 0%, #CDAD00 100%)';
            cardFront.style.color = 'white';
            break;
        case 'tech':
            cardFront.style.background = 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)';
            cardFront.style.color = 'white';
            break;
        case 'artistic':
            cardFront.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
            break;
        case 'vintage':
            cardFront.style.background = '#f7e7ce';
            cardFront.style.border = '1px solid #d4af37';
            break;
        case 'bold':
            cardFront.style.background = 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)';
            cardFront.style.color = 'white';
            break;
        case 'gradient':
            cardFront.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            cardFront.style.color = 'white';
            break;
        case 'geometric':
            cardFront.style.background = 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
            break;
    }
}

function handleLogoUpload(e) {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewLogo').src = e.target.result;
        }
        reader.readAsDataURL(this.files[0]);
        
        // Update upload area
        const uploadArea = document.getElementById('logoUpload');
        uploadArea.innerHTML = '<p>Logo uploaded successfully!</p>';
    }
}

function handleProfileUpload(e) {
    if (this.files && this.files[0]) {
        // In a full implementation, this would update a profile image on the card
        console.log('Profile image uploaded');
        
        // Update upload area
        const uploadArea = document.getElementById('profileUpload');
        uploadArea.innerHTML = '<p>Profile image uploaded successfully!</p>';
    }
}

function flipCard() {
    const cardPreview = document.getElementById('cardPreview');
    cardPreview.classList.toggle('flipped');
}

function rotateCard() {
    const cardPreview = document.getElementById('cardPreview');
    const currentRotation = cardPreview.style.transform || 'rotate(0deg)';
    const newRotation = currentRotation === 'rotate(0deg)' ? 'rotate(90deg)' : 'rotate(0deg)';
    cardPreview.style.transform = newRotation;
}

function resetCard() {
    const cardPreview = document.getElementById('cardPreview');
    cardPreview.classList.remove('flipped');
    cardPreview.style.transform = 'rotate(0deg)';
}

function triggerExport(type) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';
    
    // Use setTimeout to allow the loading overlay to render
    setTimeout(() => {
        switch(type) {
            case 'pdf':
                exportToPdf();
                break;
            case 'word':
                exportToWord();
                break;
            case 'png':
                exportToPng();
                break;
            case 'jpeg':
                exportToJpeg();
                break;
        }
    }, 100);
}

// PDF Export Function
async function exportToPdf() {
    try {
        // Check if jsPDF is available
        if (typeof jspdf === 'undefined') {
            throw new Error('PDF library not loaded');
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Get layout option
        const layoutOption = document.querySelector('.layout-option.active');
        const cardsPerPage = parseInt(layoutOption.getAttribute('data-layout')) || 8;
        
        // Make sure card is showing front side
        document.getElementById('cardPreview').classList.remove('flipped');
        
        // Capture card front
        const cardFront = document.querySelector('.card-front');
        const frontCanvas = await html2canvas(cardFront, {
            scale: 3,
            backgroundColor: null,
            useCORS: true,
            allowTaint: true,
            logging: false
        });
        
        // Capture card back
        const cardBack = document.querySelector('.card-back');
        const backCanvas = await html2canvas(cardBack, {
            scale: 3,
            backgroundColor: null,
            useCORS: true,
            allowTaint: true,
            logging: false
        });
        
        // Calculate card dimensions for A4 page
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const cardWidth = 85; // Standard business card width in mm
        const cardHeight = 55; // Standard business card height in mm
        
        // Calculate layout based on cards per page
        let cols, rows, marginX, marginY;
        switch(cardsPerPage) {
            case 6:
                cols = 2; rows = 3;
                marginX = (pageWidth - (cols * cardWidth)) / (cols + 1);
                marginY = (pageHeight - (rows * cardHeight)) / (rows + 1);
                break;
            case 8:
                cols = 2; rows = 4;
                marginX = (pageWidth - (cols * cardWidth)) / (cols + 1);
                marginY = (pageHeight - (rows * cardHeight)) / (rows + 1);
                break;
            case 10:
                cols = 2; rows = 5;
                marginX = (pageWidth - (cols * cardWidth)) / (cols + 1);
                marginY = (pageHeight - (rows * cardHeight)) / (rows + 1);
                break;
            default:
                cols = 2; rows = 4;
                marginX = (pageWidth - (cols * cardWidth)) / (cols + 1);
                marginY = (pageHeight - (rows * cardHeight)) / (rows + 1);
        }
        
        // Add front sides to PDF
        let cardCount = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (cardCount >= cardsPerPage) break;
                
                const x = marginX + col * (cardWidth + marginX);
                const y = marginY + row * (cardHeight + marginY);
                
                const frontImgData = frontCanvas.toDataURL('image/jpeg', 0.9);
                pdf.addImage(frontImgData, 'JPEG', x, y, cardWidth, cardHeight);
                cardCount++;
            }
        }
        
        // Add new page for back sides
        pdf.addPage();
        cardCount = 0;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (cardCount >= cardsPerPage) break;
                
                const x = marginX + col * (cardWidth + marginX);
                const y = marginY + row * (cardHeight + marginY);
                
                const backImgData = backCanvas.toDataURL('image/jpeg', 0.9);
                pdf.addImage(backImgData, 'JPEG', x, y, cardWidth, cardHeight);
                cardCount++;
            }
        }
        
        // Save the PDF
        pdf.save('visiting-cards.pdf');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    } finally {
        // Hide loading overlay
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

// Word Export Function
function exportToWord() {
    try {
        // Get card data
        const cardData = getCardData();
        
        // Create HTML content for Word document
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Visiting Card - ${cardData.name}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                    }
                    .card { 
                        width: 85mm; 
                        height: 55mm; 
                        border: 1px solid #ccc; 
                        padding: 10px; 
                        margin: 10px; 
                        display: inline-block;
                        vertical-align: top;
                    }
                    .name { 
                        font-size: 18px; 
                        font-weight: bold; 
                        margin-bottom: 5px; 
                    }
                    .title { 
                        font-size: 14px; 
                        color: #666; 
                        margin-bottom: 10px; 
                    }
                    .contact { 
                        font-size: 12px; 
                        margin-bottom: 3px; 
                    }
                    .company { 
                        font-size: 14px; 
                        font-weight: bold; 
                        margin-top: 10px; 
                    }
                    .page-break { 
                        page-break-after: always; 
                    }
                </style>
            </head>
            <body>
                <h1>Visiting Cards - ${cardData.name}</h1>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
                
                <!-- Front of cards -->
                <h2>Front Side</h2>
                ${Array(8).fill(0).map(() => `
                    <div class="card">
                        <div class="name">${cardData.name}</div>
                        <div class="title">${cardData.title}</div>
                        <div class="contact">📞 ${cardData.phone}</div>
                        <div class="contact">📧 ${cardData.email}</div>
                        <div class="company">${cardData.company}</div>
                    </div>
                `).join('')}
                
                <div class="page-break"></div>
                
                <!-- Back of cards -->
                <h2>Back Side</h2>
                ${Array(8).fill(0).map(() => `
                    <div class="card">
                        <div class="company">${cardData.company}</div>
                        <div class="contact">📍 ${cardData.address}</div>
                        <div class="contact">🌐 ${cardData.website}</div>
                        <div style="margin-top: 15px; text-align: center;">
                            <div style="width: 50px; height: 50px; background: #f0f0f0; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                                QR Code
                            </div>
                            <div style="font-size: 10px; margin-top: 5px;">Scan for more info</div>
                        </div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;
        
        // Create Blob and download
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const link = document.createElement('a');
        link.download = 'visiting-cards.doc';
        link.href = URL.createObjectURL(blob);
        link.click();
        
        // Clean up
        URL.revokeObjectURL(link.href);
        
    } catch (error) {
        console.error('Error generating Word document:', error);
        alert('Error generating Word document. Please try again.');
    } finally {
        // Hide loading overlay
        document.getElementById('loadingOverlay').style.display = 'none';
    }
}

// PNG Export Function
function exportToPng() {
    // Make sure card is showing front side
    document.getElementById('cardPreview').classList.remove('flipped');
    
    // Capture card as PNG
    const cardElement = document.querySelector('.card-front');
    
    html2canvas(cardElement, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'visiting-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
        console.error('Error generating PNG:', error);
        alert('Error generating PNG. Please try again.');
    }).finally(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    });
}

// JPEG Export Function
function exportToJpeg() {
    // Make sure card is showing front side
    document.getElementById('cardPreview').classList.remove('flipped');
    
    // Capture card as JPEG
    const cardElement = document.querySelector('.card-front');
    
    html2canvas(cardElement, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'visiting-card.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    }).catch(error => {
        console.error('Error generating JPEG:', error);
        alert('Error generating JPEG. Please try again.');
    }).finally(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    });
}

function getCardData() {
    // Extract data from form inputs
    return {
        name: document.getElementById('fullName').value || 'Your Name',
        title: document.getElementById('jobTitle').value || 'Job Title',
        company: document.getElementById('company').value || 'Company Name',
        email: document.getElementById('email').value || 'your@email.com',
        phone: document.getElementById('phone').value || '+1234567890',
        address: document.getElementById('address').value || 'Your Address',
        website: document.getElementById('website').value || 'www.yourwebsite.com'
    };
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    const icon = document.querySelector('#themeToggle i');
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}