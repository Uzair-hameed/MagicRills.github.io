// PDF Export Functionality
function generatePDF() {
    // Show loading indicator
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Generating PDF...';
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
    
    // Use html2canvas to capture the certificate
    html2canvas(document.getElementById('certificate'), {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // Use jsPDF to create a PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4');
        
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        
        // Add the certificate image to PDF
        doc.addImage(imgData, 'PNG', 0, 0, width, height);
        
        // Remove loading indicator
        document.body.removeChild(loadingText);
        
        // Save the PDF
        doc.save('certificate.pdf');
    }).catch(error => {
        console.error('Error generating PDF:', error);
        document.body.removeChild(loadingText);
        alert('Error generating PDF. Please try again.');
    });
}