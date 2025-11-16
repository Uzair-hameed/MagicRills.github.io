// Main JavaScript for Certificate Generator
document.addEventListener('DOMContentLoaded', function() {
    // Get all DOM elements
    const titleInput = document.getElementById('title');
    const subtitleInput = document.getElementById('subtitle');
    const recipientInput = document.getElementById('recipient');
    const bodyTextInput = document.getElementById('bodyText');
    const dateInput = document.getElementById('date');
    const titleColorInput = document.getElementById('titleColor');
    const borderColorInput = document.getElementById('borderColor');
    const backgroundColorInput = document.getElementById('backgroundColor');
    const borderStyleInput = document.getElementById('borderStyle');
    const bgPatternInput = document.getElementById('bgPattern');
    const templateSelect = document.getElementById('templateSelect');
    
    // Logo uploads
    const logoLeftUpload = document.getElementById('logoLeftUpload');
    const logoCenterUpload = document.getElementById('logoCenterUpload');
    const logoRightUpload = document.getElementById('logoRightUpload');
    
    // Signatures
    const signature1Input = document.getElementById('signature1');
    const signature1TitleInput = document.getElementById('signature1Title');
    const signature1Upload = document.getElementById('signature1Upload');
    const signature2Input = document.getElementById('signature2');
    const signature2TitleInput = document.getElementById('signature2Title');
    const signature2Upload = document.getElementById('signature2Upload');
    
    // Fonts
    const titleFontSelect = document.getElementById('titleFont');
    const bodyFontSelect = document.getElementById('bodyFont');
    const signatureFontSelect = document.getElementById('signatureFont');
    
    // Buttons
    const resetBtn = document.getElementById('resetBtn');
    const themeBtn = document.getElementById('themeBtn');
    const previewBtn = document.getElementById('previewBtn');
    const pdfBtn = document.getElementById('pdfBtn');
    const docBtn = document.getElementById('docBtn');
    const pngBtn = document.getElementById('pngBtn');
    const jpegBtn = document.getElementById('jpegBtn');
    
    // Certificate elements
    const certTitle = document.getElementById('certTitle');
    const certSubtitle = document.getElementById('certSubtitle');
    const certRecipient = document.getElementById('certRecipient');
    const certBodyText = document.getElementById('certBodyText');
    const certDate = document.getElementById('certDate');
    
    // Logo elements
    const certLogoLeft = document.getElementById('certLogoLeft');
    const certLogoCenter = document.getElementById('certLogoCenter');
    const certLogoRight = document.getElementById('certLogoRight');
    
    // Signature elements
    const signature1Img = document.getElementById('signature1Img');
    const signature2Img = document.getElementById('signature2Img');
    const signature1Name = document.getElementById('signature1Name');
    const signature1Title = document.getElementById('signature1Title');
    const signature2Name = document.getElementById('signature2Name');
    const signature2Title = document.getElementById('signature2Title');
    
    // Certificate container elements
    const certBorder = document.querySelector('.cert-border');
    const certBg = document.querySelector('.cert-bg');
    const certificate = document.getElementById('certificate');
    
    // Set up event listeners
    titleInput.addEventListener('input', updateCertificate);
    subtitleInput.addEventListener('input', updateCertificate);
    recipientInput.addEventListener('input', updateCertificate);
    bodyTextInput.addEventListener('input', updateCertificate);
    dateInput.addEventListener('input', updateCertificate);
    titleColorInput.addEventListener('input', updateCertificate);
    borderColorInput.addEventListener('input', updateCertificate);
    backgroundColorInput.addEventListener('input', updateCertificate);
    borderStyleInput.addEventListener('change', updateCertificate);
    bgPatternInput.addEventListener('change', updateCertificate);
    templateSelect.addEventListener('change', applyTemplate);
    
    // Font changes
    titleFontSelect.addEventListener('change', updateCertificate);
    bodyFontSelect.addEventListener('change', updateCertificate);
    signatureFontSelect.addEventListener('change', updateCertificate);
    
    // Logo uploads
    logoLeftUpload.addEventListener('change', handleLogoUpload);
    logoCenterUpload.addEventListener('change', handleLogoUpload);
    logoRightUpload.addEventListener('change', handleLogoUpload);
    
    // Signature uploads and inputs
    signature1Upload.addEventListener('change', handleSignatureUpload);
    signature2Upload.addEventListener('change', handleSignatureUpload);
    signature1Input.addEventListener('input', updateCertificate);
    signature1TitleInput.addEventListener('input', updateCertificate);
    signature2Input.addEventListener('input', updateCertificate);
    signature2TitleInput.addEventListener('input', updateCertificate);
    
    // Button events
    resetBtn.addEventListener('click', resetForm);
    themeBtn.addEventListener('click', toggleTheme);
    previewBtn.addEventListener('click', previewCertificate);
    pdfBtn.addEventListener('click', exportToPDF);
    docBtn.addEventListener('click', exportToWord);
    pngBtn.addEventListener('click', exportToPNG);
    jpegBtn.addEventListener('click', exportToJPEG);
    
    // Initialize the certificate with default values
    updateCertificate();
    
    // Function to update the certificate preview
    function updateCertificate() {
        // Update text content
        certTitle.textContent = titleInput.value;
        certSubtitle.textContent = subtitleInput.value;
        certRecipient.textContent = recipientInput.value;
        certBodyText.textContent = bodyTextInput.value;
        certDate.textContent = dateInput.value;
        
        // Update colors
        certTitle.style.color = titleColorInput.value;
        certBorder.style.borderColor = borderColorInput.value;
        certificate.style.backgroundColor = backgroundColorInput.value;
        
        // Update signature text
        signature1Name.textContent = signature1Input.value;
        signature1Title.textContent = signature1TitleInput.value;
        signature2Name.textContent = signature2Input.value;
        signature2Title.textContent = signature2TitleInput.value;
        
        // Update fonts
        updateFonts();
        
        // Update border style
        updateBorderStyle();
        
        // Update background pattern
        updateBackgroundPattern();
    }
    
    // Function to update fonts
    function updateFonts() {
        // Remove all font classes
        certTitle.className = 'cert-title';
        certSubtitle.className = 'cert-subtitle';
        certRecipient.className = 'recipient-name';
        certBodyText.className = 'body-text';
        certDate.className = 'cert-date';
        
        signature1Name.className = 'signature-name';
        signature1Title.className = 'signature-title';
        signature2Name.className = 'signature-name';
        signature2Title.className = 'signature-title';
        
        // Add selected font classes
        certTitle.classList.add(titleFontSelect.value);
        certSubtitle.classList.add(titleFontSelect.value);
        certRecipient.classList.add(bodyFontSelect.value);
        certBodyText.classList.add(bodyFontSelect.value);
        certDate.classList.add(bodyFontSelect.value);
        
        signature1Name.classList.add(signatureFontSelect.value);
        signature1Title.classList.add(signatureFontSelect.value);
        signature2Name.classList.add(signatureFontSelect.value);
        signature2Title.classList.add(signatureFontSelect.value);
    }
    
    // Function to handle logo upload
    function handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const targetId = event.target.id;
                if (targetId === 'logoLeftUpload') {
                    certLogoLeft.src = e.target.result;
                    certLogoLeft.style.display = 'block';
                } else if (targetId === 'logoCenterUpload') {
                    certLogoCenter.src = e.target.result;
                    certLogoCenter.style.display = 'block';
                } else if (targetId === 'logoRightUpload') {
                    certLogoRight.src = e.target.result;
                    certLogoRight.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Function to handle signature upload
    function handleSignatureUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const targetId = event.target.id;
                if (targetId === 'signature1Upload') {
                    signature1Img.src = e.target.result;
                    signature1Img.style.display = 'block';
                } else if (targetId === 'signature2Upload') {
                    signature2Img.src = e.target.result;
                    signature2Img.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Function to update border style
    function updateBorderStyle() {
        const style = borderStyleInput.value;
        
        // Remove all border classes
        certBorder.className = 'cert-border';
        
        // Add selected border class
        if (style !== 'solid') {
            certBorder.classList.add(`border-${style}`);
        }
        
        // Special handling for ornate borders
        if (style === 'ornate' || style === 'floral' || style === 'scroll') {
            certBorder.style.borderImageSource = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="${encodeURIComponent(borderColorInput.value)}" stroke-width="2"/></svg>')`;
            certBorder.style.borderImageSlice = '30';
            certBorder.style.borderImageRepeat = 'round';
            certBorder.style.borderWidth = '15px';
        } else {
            certBorder.style.borderImage = 'none';
        }
    }
    
    // Function to update background pattern
    function updateBackgroundPattern() {
        const pattern = bgPatternInput.value;
        certBg.style.backgroundImage = 'none';
        
        switch(pattern) {
            case 'dots':
                certBg.style.backgroundImage = 'radial-gradient(circle, #000000 1px, transparent 1px)';
                certBg.style.backgroundSize = '20px 20px';
                certBg.style.opacity = '0.05';
                break;
            case 'lines':
                certBg.style.backgroundImage = 'repeating-linear-gradient(0deg, transparent, transparent 19px, #000000 20px)';
                certBg.style.opacity = '0.05';
                break;
            case 'squares':
                certBg.style.backgroundImage = 'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)';
                certBg.style.backgroundSize = '20px 20px';
                certBg.style.opacity = '0.05';
                break;
            case 'zigzag':
                certBg.style.backgroundImage = 'linear-gradient(135deg, #000000 25%, transparent 25%), linear-gradient(225deg, #000000 25%, transparent 25%), linear-gradient(315deg, #000000 25%, transparent 25%), linear-gradient(45deg, #000000 25%, transparent 25%)';
                certBg.style.backgroundSize = '20px 20px';
                certBg.style.opacity = '0.05';
                break;
            case 'seamless':
                certBg.style.backgroundImage = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><circle cx=\'50\' cy=\'50\' r=\'2\' fill=\'%23000000\' opacity=\'0.1\'/></svg>")';
                certBg.style.backgroundSize = '50px 50px';
                certBg.style.opacity = '0.1';
                break;
            case 'watermark':
                certBg.style.backgroundImage = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'><text x=\'100\' y=\'100\' font-family=\'Arial\' font-size=\'24\' fill=\'%23000000\' opacity=\'0.03\' text-anchor=\'middle\'>CERTIFICATE</text></svg>")';
                certBg.style.backgroundSize = '300px 300px';
                certBg.style.opacity = '0.1';
                break;
            default:
                certBg.style.opacity = '0.05';
        }
    }
    
    // Function to apply a template
    function applyTemplate() {
        const templateId = templateSelect.value;
        
        switch(templateId) {
            case '1': // Classic Elegant
                titleColorInput.value = '#4e54c8';
                borderColorInput.value = '#4e54c8';
                backgroundColorInput.value = '#fefefe';
                borderStyleInput.value = 'double';
                bgPatternInput.value = 'seamless';
                titleFontSelect.value = 'font-playfair';
                bodyFontSelect.value = 'font-elegant';
                signatureFontSelect.value = 'font-dancing';
                break;
            case '2': // Modern Professional
                titleColorInput.value = '#2c3e50';
                borderColorInput.value = '#3498db';
                backgroundColorInput.value = '#ffffff';
                borderStyleInput.value = 'solid';
                bgPatternInput.value = 'none';
                titleFontSelect.value = 'font-modern';
                bodyFontSelect.value = 'font-modern';
                signatureFontSelect.value = 'font-modern';
                break;
            case '3': // Vintage Parchment
                titleColorInput.value = '#8B4513';
                borderColorInput.value = '#8B4513';
                backgroundColorInput.value = '#F5E9D7';
                borderStyleInput.value = 'ornate';
                bgPatternInput.value = 'watermark';
                titleFontSelect.value = 'font-old-english';
                bodyFontSelect.value = 'font-old-standard';
                signatureFontSelect.value = 'font-great-vibes';
                break;
            case '4': // Academic Honor
                titleColorInput.value = '#1a5276';
                borderColorInput.value = '#1a5276';
                backgroundColorInput.value = '#ffffff';
                borderStyleInput.value = 'double';
                bgPatternInput.value = 'lines';
                titleFontSelect.value = 'font-cinzel';
                bodyFontSelect.value = 'font-old-standard';
                signatureFontSelect.value = 'font-elegant';
                break;
            case '5': // Corporate Achievement
                titleColorInput.value = '#2c3e50';
                borderColorInput.value = '#e74c3c';
                backgroundColorInput.value = '#ffffff';
                borderStyleInput.value = 'solid';
                bgPatternInput.value = 'dots';
                titleFontSelect.value = 'font-modern';
                bodyFontSelect.value = 'font-modern';
                signatureFontSelect.value = 'font-modern';
                break;
            case '6': // Medieval Scroll
                titleColorInput.value = '#5d4037';
                borderColorInput.value = '#5d4037';
                backgroundColorInput.value = '#fff9e6';
                borderStyleInput.value = 'scroll';
                bgPatternInput.value = 'watermark';
                titleFontSelect.value = 'font-medieval';
                bodyFontSelect.value = 'font-almendra';
                signatureFontSelect.value = 'font-medieval';
                break;
            case '7': // Artistic Floral
                titleColorInput.value = '#e91e63';
                borderColorInput.value = '#e91e63';
                backgroundColorInput.value = '#fff9f9';
                borderStyleInput.value = 'floral';
                bgPatternInput.value = 'seamless';
                titleFontSelect.value = 'font-parisienne';
                bodyFontSelect.value = 'font-dancing';
                signatureFontSelect.value = 'font-rouge';
                break;
            case '8': // Minimalist Clean
                titleColorInput.value = '#333333';
                borderColorInput.value = '#cccccc';
                backgroundColorInput.value = '#ffffff';
                borderStyleInput.value = 'solid';
                bgPatternInput.value = 'none';
                titleFontSelect.value = 'font-modern';
                bodyFontSelect.value = 'font-modern';
                signatureFontSelect.value = 'font-modern';
                break;
            case '9': // Golden Luxury
                titleColorInput.value = '#d4af37';
                borderColorInput.value = '#d4af37';
                backgroundColorInput.value = '#fffdf0';
                borderStyleInput.value = 'double';
                bgPatternInput.value = 'seamless';
                titleFontSelect.value = 'font-cinzel';
                bodyFontSelect.value = 'font-playfair';
                signatureFontSelect.value = 'font-great-vibes';
                break;
            case '10': // Blue Corporate
                titleColorInput.value = '#1e3a8a';
                borderColorInput.value = '#1e3a8a';
                backgroundColorInput.value = '#f0f9ff';
                borderStyleInput.value = 'solid';
                bgPatternInput.value = 'dots';
                titleFontSelect.value = 'font-modern';
                bodyFontSelect.value = 'font-modern';
                signatureFontSelect.value = 'font-elegant';
                break;
            case '11': // Green Nature
                titleColorInput.value = '#065f46';
                borderColorInput.value = '#065f46';
                backgroundColorInput.value = '#f0fdf4';
                borderStyleInput.value = 'dashed';
                bgPatternInput.value = 'none';
                titleFontSelect.value = 'font-almendra';
                bodyFontSelect.value = 'font-old-standard';
                signatureFontSelect.value = 'font-tangerine';
                break;
            case '12': // Red Prestige
                titleColorInput.value = '#991b1b';
                borderColorInput.value = '#991b1b';
                backgroundColorInput.value = '#fef2f2';
                borderStyleInput.value = 'solid';
                bgPatternInput.value = 'zigzag';
                titleFontSelect.value = 'font-playfair';
                bodyFontSelect.value = 'font-elegant';
                signatureFontSelect.value = 'font-dancing';
                break;
            case '13': // Purple Royal
                titleColorInput.value = '#6b21a8';
                borderColorInput.value = '#6b21a8';
                backgroundColorInput.value = '#faf5ff';
                borderStyleInput.value = 'double';
                bgPatternInput.value = 'seamless';
                titleFontSelect.value = 'font-cinzel';
                bodyFontSelect.value = 'font-playfair';
                signatureFontSelect.value = 'font-great-vibes';
                break;
            case '14': // Orange Energy
                titleColorInput.value = '#ea580c';
                borderColorInput.value = '#ea580c';
                backgroundColorInput.value = '#fff7ed';
                borderStyleInput.value = 'solid';
                bgPatternInput.value = 'squares';
                titleFontSelect.value = 'font-modern';
                bodyFontSelect.value = 'font-modern';
                signatureFontSelect.value = 'font-modern';
                break;
            case '15': // Tech Modern
                titleColorInput.value = '#0ea5e9';
                borderColorInput.value = '#0ea5e9';
                backgroundColorInput.value = '#f0f9ff';
                borderStyleInput.value = 'dotted';
                bgPatternInput.value = 'lines';
                titleFontSelect.value = 'font-modern';
                bodyFontSelect.value = 'font-modern';
                signatureFontSelect.value = 'font-modern';
                break;
        }
        
        updateCertificate();
    }
    
    // Function to toggle dark/light theme
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    }
    
    // Function to reset the form
    function resetForm() {
        if (!confirm('Are you sure you want to reset all changes?')) return;
        
        titleInput.value = 'Certificate of Achievement';
        subtitleInput.value = 'This certificate is proudly presented to';
        recipientInput.value = 'John Doe';
        bodyTextInput.value = 'For outstanding performance and dedication in the field of web development. Your hard work and commitment have been recognized and appreciated by the entire team.';
        dateInput.value = 'October 15, 2023';
        titleColorInput.value = '#4e54c8';
        borderColorInput.value = '#4e54c8';
        backgroundColorInput.value = '#ffffff';
        borderStyleInput.value = 'solid';
        bgPatternInput.value = 'none';
        signature1Input.value = 'Jane Smith';
        signature1TitleInput.value = 'CEO, Company Inc.';
        signature2Input.value = 'Robert Johnson';
        signature2TitleInput.value = 'Director of Education';
        templateSelect.value = '1';
        titleFontSelect.value = 'font-old-english';
        bodyFontSelect.value = 'font-modern';
        signatureFontSelect.value = 'font-elegant';
        
        // Reset images
        certLogoLeft.src = '';
        certLogoLeft.style.display = 'none';
        certLogoCenter.src = '';
        certLogoCenter.style.display = 'none';
        certLogoRight.src = '';
        certLogoRight.style.display = 'none';
        signature1Img.src = '';
        signature1Img.style.display = 'none';
        signature2Img.src = '';
        signature2Img.style.display = 'none';
        
        // Reset file inputs
        logoLeftUpload.value = '';
        logoCenterUpload.value = '';
        logoRightUpload.value = '';
        signature1Upload.value = '';
        signature2Upload.value = '';
        
        // Reset theme if dark
        if (document.body.classList.contains('dark-theme')) {
            toggleTheme();
        }
        
        updateCertificate();
    }
    
    // Function to preview certificate
    function previewCertificate() {
        // Create a modal preview
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        const certificateClone = certificate.cloneNode(true);
        certificateClone.style.transform = 'scale(0.9)';
        certificateClone.style.maxHeight = '90vh';
        certificateClone.style.overflow = 'auto';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close Preview';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.padding = '10px 20px';
        closeBtn.style.backgroundColor = '#ff6b6b';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '5px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.zIndex = '1001';
        
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.appendChild(certificateClone);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Export functions (implemented in separate files)
    function exportToPDF() {
        // Implemented in certificate-generator-pdf.js
        if (typeof generatePDF === 'function') {
            generatePDF();
        } else {
            alert('PDF export functionality is not available. Please check if certificate-generator-pdf.js is loaded.');
        }
    }
    
    function exportToWord() {
        // Implemented in certificate-generator-word.js
        if (typeof generateWord === 'function') {
            generateWord();
        } else {
            alert('Word export functionality is not available. Please check if certificate-generator-word.js is loaded.');
        }
    }
    
    function exportToPNG() {
        html2canvas(certificate).then(canvas => {
            const link = document.createElement('a');
            link.download = 'certificate.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
    
    function exportToJPEG() {
        html2canvas(certificate).then(canvas => {
            const link = document.createElement('a');
            link.download = 'certificate.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        });
    }
});