// Export functionality for PDF and DOC
class ResumeExporter {
    constructor(app) {
        this.app = app;
    }

    async downloadPDF() {
        this.showLoading();
        
        try {
            const canvas = await html2canvas(document.getElementById('resume-preview'), {
                scale: 2,
                useCORS: true,
                logging: false
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('resume.pdf');
            
            this.hideLoading();
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.hideLoading();
            alert('Error generating PDF. Please try again.');
        }
    }

    downloadDOC() {
        this.showLoading();
        
        try {
            const htmlContent = this.generateDOCContent();
            const blob = new Blob([htmlContent], { type: 'application/msword' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'resume.doc';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error generating DOC:', error);
            this.hideLoading();
            alert('Error generating DOC file. Please try again.');
        }
    }

    generateDOCContent() {
        const personal = this.app.resumeData.personal;
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Resume - ${personal.name || 'Your Name'}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    h1 { color: #2c3e50; font-size: 24pt; margin-bottom: 5px; }
                    h2 { color: #3498db; font-size: 14pt; border-bottom: 1px solid #3498db; padding-bottom: 3px; }
                </style>
            </head>
            <body>
                <h1>${personal.name || 'Your Name'}</h1>
                <div>${personal.title || 'Professional Title'}</div>
                <!-- Add more content here -->
            </body>
            </html>
        `;
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
}