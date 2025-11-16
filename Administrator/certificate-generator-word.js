// Word Export Functionality
function generateWord() {
    // Show loading indicator
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Generating Word Document...';
    loadingText.style.position = 'fixed';
    loadingText.style.top = '50%';
    loadingText.style.left = '50%';
    loadingText.style.transform = 'translate(-50%, -50%)';
    loadingText.style.backgroundColor = 'rgba(0,0,0,0.8)';
    loadingText.style.color = 'white';
    loadingText.style.padding = '20px';
    loadingText.style.borderRadius = '5px';
    loadingText.style.zIndex = '10000';
    document.body.appendChild(loadingText);
    
    try {
        // Get certificate data
        const title = document.getElementById('certTitle').textContent;
        const subtitle = document.getElementById('certSubtitle').textContent;
        const recipient = document.getElementById('certRecipient').textContent;
        const bodyText = document.getElementById('certBodyText').textContent;
        const date = document.getElementById('certDate').textContent;
        const signature1Name = document.getElementById('signature1Name').textContent;
        const signature1Title = document.getElementById('signature1Title').textContent;
        const signature2Name = document.getElementById('signature2Name').textContent;
        const signature2Title = document.getElementById('signature2Title').textContent;
        
        // Create a simple HTML representation for Word
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Certificate</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 40px; 
                        text-align: center;
                    }
                    .certificate { 
                        border: 2px solid #4e54c8; 
                        padding: 40px; 
                        margin: 0 auto;
                        max-width: 800px;
                    }
                    .title { 
                        font-size: 36px; 
                        font-weight: bold; 
                        color: #4e54c8; 
                        margin-bottom: 20px;
                    }
                    .subtitle { 
                        font-size: 20px; 
                        margin-bottom: 30px; 
                        color: #666;
                    }
                    .recipient { 
                        font-size: 28px; 
                        font-weight: bold; 
                        margin: 30px 0; 
                        border-bottom: 2px solid #4e54c8;
                        display: inline-block;
                        padding-bottom: 10px;
                    }
                    .body-text { 
                        font-size: 18px; 
                        line-height: 1.6; 
                        margin: 30px 0;
                        max-width: 80%;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .date { 
                        font-size: 18px; 
                        font-weight: bold; 
                        margin-top: 30px;
                    }
                    .signatures {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 60px;
                    }
                    .signature {
                        text-align: center;
                        flex: 1;
                    }
                    .signature-line {
                        width: 200px;
                        border-top: 1px solid #000;
                        margin: 10px auto;
                    }
                    .signature-name {
                        font-weight: bold;
                        margin-top: 5px;
                    }
                    .signature-title {
                        font-style: italic;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <div class="title">${title}</div>
                    <div class="subtitle">${subtitle}</div>
                    
                    <div class="recipient">${recipient}</div>
                    
                    <div class="body-text">${bodyText}</div>
                    
                    <div class="date">${date}</div>
                    
                    <div class="signatures">
                        <div class="signature">
                            <div class="signature-line"></div>
                            <div class="signature-name">${signature1Name}</div>
                            <div class="signature-title">${signature1Title}</div>
                        </div>
                        
                        <div class="signature">
                            <div class="signature-line"></div>
                            <div class="signature-name">${signature2Name}</div>
                            <div class="signature-title">${signature2Title}</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // Create a Blob with the HTML content
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        
        // Remove loading indicator
        document.body.removeChild(loadingText);
        
        // Save the file
        saveAs(blob, 'certificate.doc');
        
    } catch (error) {
        console.error('Error generating Word document:', error);
        document.body.removeChild(loadingText);
        alert('Error generating Word document. Please try again.');
    }
}